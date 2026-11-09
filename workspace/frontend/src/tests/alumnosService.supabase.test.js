// Anchored to REQ-ALU-001, REQ-ALU-002, REQ-ALU-003, REQ-ALU-005, REQ-ALU-006, REQ-ALU-009, REQ-ALU-011, REQ-ALU-012
import { describe, expect, test, beforeEach, afterAll } from 'vitest'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'

const isSupabaseEnabled = process.env.RUN_SUPABASE_TESTS === 'true'
const runIfSupabase = isSupabaseEnabled ? describe : describe.skip

runIfSupabase('supabaseAdapter - Gestión de Alumnos y Ficha Médica (Docker Supabase)', () => {
  beforeEach(async () => {
    await supabaseAuthAdapter.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await supabaseAuthAdapter.logout()
  })

  test('REQ-ALU-001: getAlumnos retorna datos relacionales completos desde Postgres', async () => {
    const alumnos = await supabaseAdapter.getAlumnos()
    expect(Array.isArray(alumnos)).toBe(true)
    expect(alumnos.length).toBeGreaterThan(0)

    const primerAlumno = alumnos[0]
    expect(primerAlumno).toHaveProperty('id_persona')
    expect(primerAlumno).toHaveProperty('nombre')
    expect(primerAlumno).toHaveProperty('apellido')
    expect(primerAlumno).toHaveProperty('email')
    expect(primerAlumno).toHaveProperty('cantidad_dias_rutina')
  })

  test('REQ-ALU-002, REQ-ALU-011: crearAlumno ejecuta la función RPC alta_alumno_profesor atómicamente', async () => {
    const timestamp = Date.now()
    const nuevoAlumno = {
      nombre: 'Enzo',
      apellido: 'Fernandez',
      nombre_usuario: `enzo_${timestamp}`,
      email: `enzo_${timestamp}@alumno.com`,
      password: 'TempPassword123!',
      telefono: '+54 9 11 9999-8888',
      id_gimnasio: 1,
      cantidad_dias_rutina: 5,
      altura_cm: 178,
      peso_kg: 77.5,
      salud_enfermedades: 'Sin antecedentes clínicos relevantes.',
      comentario: 'Planificación de pretemporada.',
    }

    const res = await supabaseAdapter.crearAlumno(nuevoAlumno)
    expect(res.ok).toBe(true)
    expect(res.data.id_persona).toBeDefined()

    // Control de duplicados en la función RPC (REQ-ALU-005)
    const dupRes = await supabaseAdapter.crearAlumno({
      ...nuevoAlumno,
      nombre_usuario: `otro_${timestamp}`,
    })
    expect(dupRes.ok).toBe(false)
    expect(dupRes.error.code).toBe('DUPLICATE_USER_CREDENTIALS')
  })

  test('REQ-ALU-003: actualizarAlumno modifica datos en personas y perfil_alumno', async () => {
    const alumnos = await supabaseAdapter.getAlumnos()
    const target = alumnos[0]

    const res = await supabaseAdapter.actualizarAlumno(target.id_persona, {
      nombre: `${target.nombre} Edit`,
      peso_kg: 81.2,
      salud_enfermedades: 'Control preventivo anual realizado.',
      cantidad_dias_rutina: 4,
    })

    expect(res.ok).toBe(true)

    const updated = await supabaseAdapter.getAlumnoById(target.id_persona)
    expect(updated.peso_kg).toBe(81.2)
    expect(updated.cantidad_dias_rutina).toBe(4)
  })

  test('REQ-ALU-006: cambiarEstadoAlumno realiza baja lógica y reactivación en Supabase', async () => {
    const alumnos = await supabaseAdapter.getAlumnos()
    const target = alumnos[alumnos.length - 1]

    const bajaRes = await supabaseAdapter.cambiarEstadoAlumno(target.id_persona, false)
    expect(bajaRes.ok).toBe(true)
    expect(bajaRes.estado).toBe(false)

    const bajaCheck = await supabaseAdapter.getAlumnoById(target.id_persona)
    expect(bajaCheck.estado).toBe(false)

    const activaRes = await supabaseAdapter.cambiarEstadoAlumno(target.id_persona, true)
    expect(activaRes.ok).toBe(true)
    expect(activaRes.estado).toBe(true)
  })

  test('REQ-ALU-009: getMiPerfilAlumno retorna ficha del alumno con datos del profesor', async () => {
    const perfil = await supabaseAdapter.getMiPerfilAlumno()
    expect(perfil).not.toBeNull()
    expect(perfil.id_persona).toBeDefined()
    expect(perfil.profesor).toBeDefined()
    expect(perfil.profesor.nombre).toBe('Leandro')
  })
})
