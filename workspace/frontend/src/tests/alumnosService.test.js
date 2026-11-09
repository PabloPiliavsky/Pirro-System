// Anchored to REQ-ALU-001, REQ-ALU-002, REQ-ALU-003, REQ-ALU-004, REQ-ALU-005, REQ-ALU-006, REQ-ALU-010, REQ-ALU-012
import { describe, expect, test, beforeEach } from 'vitest'
import {
  fetchAlumnos,
  fetchAlumnoById,
  saveAlumno,
  updateAlumno,
  setAlumnoEstado,
  fetchMiPerfilAlumno,
} from '@/services/alumnosService'
import { validateAlumnoPayload } from '@/services/validators/alumnosValidator'
import {
  calcularEdad,
  calcularIMC,
  formatearWhatsAppLink,
  formatearFecha,
} from '@/features/alumnos/utils/alumnoFormatters'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('alumnosService & formatters (Mock Provider)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('validateAlumnoPayload detecta campos obligatorios y rangos incorrectos', () => {
    expect(validateAlumnoPayload(null).ok).toBe(false)
    expect(validateAlumnoPayload({ nombre: '' }).ok).toBe(false)
    expect(
      validateAlumnoPayload({
        nombre: 'Juan',
        apellido: 'Perez',
        nombre_usuario: 'juan',
        email: 'invalido',
      }).ok
    ).toBe(false)

    expect(
      validateAlumnoPayload({
        nombre: 'Juan',
        apellido: 'Perez',
        nombre_usuario: 'juan',
        email: 'juan@test.com',
        cantidad_dias_rutina: 8,
      }).ok
    ).toBe(false)

    expect(
      validateAlumnoPayload({
        nombre: 'Juan',
        apellido: 'Perez',
        nombre_usuario: 'juan',
        email: 'juan@test.com',
        cantidad_dias_rutina: 3,
        altura_cm: 180,
        peso_kg: 75,
      }).ok
    ).toBe(true)
  })

  test('alumnoFormatters: edad, IMC, WhatsApp y fecha formateada', () => {
    expect(calcularEdad(null)).toBeNull()
    expect(calcularEdad('1990-01-01')).toBeGreaterThan(30)

    const imc = calcularIMC(80, 180)
    expect(imc).not.toBeNull()
    expect(imc.valor).toBe(24.7)
    expect(imc.categoria).toBe('Peso normal')

    const wa = formatearWhatsAppLink('+54 9 11 5555-0202', 'Martín')
    expect(wa).toContain('https://wa.me/5491155550202')
    expect(wa).toContain('Mart%C3%ADn')

    expect(formatearFecha('2026-10-08')).toBe('08/10/2026')
    expect(formatearFecha(null)).toBe('-')
  })

  test('fetchAlumnos retorna lista relacional completa con usuarios y gimnasios', async () => {
    const list = await fetchAlumnos()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)

    const first = list[0]
    expect(first).toHaveProperty('id_persona')
    expect(first).toHaveProperty('nombre_completo')
    expect(first).toHaveProperty('email')
    expect(first).toHaveProperty('cantidad_dias_rutina')
  })

  test('fetchAlumnoById retorna alumno existente o null si no existe', async () => {
    const alumno = await fetchAlumnoById(2)
    expect(alumno).not.toBeNull()
    expect(alumno.nombre).toBe('Martín')

    const notFound = await fetchAlumnoById(99999)
    expect(notFound).toBeNull()
  })

  test('saveAlumno valida datos y persiste de manera atómica sin duplicados', async () => {
    const nuevo = {
      nombre: 'Carlos',
      apellido: 'Tevez',
      nombre_usuario: 'carlos.tevez',
      email: 'carlos.tevez@alumno.com',
      password: 'MiPassword123!',
      telefono: '+54 9 11 4444-1111',
      id_gimnasio: 1,
      cantidad_dias_rutina: 4,
      altura_cm: 173,
      peso_kg: 77,
      salud_enfermedades: 'Molestia en gemelo derecho.',
      comentario: 'Enfoque en resistencia.',
    }

    const created = await saveAlumno(nuevo)
    expect(created.ok).toBe(true)
    expect(created.data.id_persona).toBeDefined()

    // Control de duplicados por email
    const duplicateEmail = await saveAlumno({
      ...nuevo,
      nombre_usuario: 'otro.usuario',
    })
    expect(duplicateEmail.ok).toBe(false)
    expect(duplicateEmail.error.code).toBe('DUPLICATE_USER_CREDENTIALS')

    // Control de duplicados por nombre_usuario
    const duplicateUser = await saveAlumno({
      ...nuevo,
      email: 'otro@correo.com',
    })
    expect(duplicateUser.ok).toBe(false)
    expect(duplicateUser.error.code).toBe('DUPLICATE_USER_CREDENTIALS')
  })

  test('updateAlumno actualiza campos del alumno y ficha médica', async () => {
    const updateRes = await updateAlumno(2, {
      nombre: 'Martín Modificado',
      apellido: 'Gómez',
      altura_cm: 180,
      peso_kg: 82.5,
      salud_enfermedades: 'Recuperado de lesión previa.',
      cantidad_dias_rutina: 5,
    })

    expect(updateRes.ok).toBe(true)

    const updated = await fetchAlumnoById(2)
    expect(updated.nombre).toBe('Martín Modificado')
    expect(updated.peso_kg).toBe(82.5)
    expect(updated.salud_enfermedades).toBe('Recuperado de lesión previa.')
    expect(updated.cantidad_dias_rutina).toBe(5)
  })

  test('setAlumnoEstado alterna baja lógica y reactivación', async () => {
    const deactivateRes = await setAlumnoEstado(2, false)
    expect(deactivateRes.ok).toBe(true)
    expect(deactivateRes.estado).toBe(false)

    let alumno = await fetchAlumnoById(2)
    expect(alumno.estado).toBe(false)

    const activateRes = await setAlumnoEstado(2, true)
    expect(activateRes.ok).toBe(true)
    expect(activateRes.estado).toBe(true)

    alumno = await fetchAlumnoById(2)
    expect(alumno.estado).toBe(true)
  })

  test('fetchMiPerfilAlumno retorna el perfil completo con contacto del profesor', async () => {
    const miPerfil = await fetchMiPerfilAlumno(2)
    expect(miPerfil).not.toBeNull()
    expect(miPerfil.id_persona).toBe(2)
    expect(miPerfil.profesor).toBeDefined()
    expect(miPerfil.profesor.nombre).toBe('Leandro')
    expect(miPerfil.profesor.email).toBe('leandro@pirrosystem.com')
  })
})
