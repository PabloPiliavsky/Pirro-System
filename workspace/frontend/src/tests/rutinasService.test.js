// Anchored to REQ-RUT-001, REQ-RUT-004, REQ-RUT-005, REQ-RUT-006, REQ-RUT-007, REQ-RUT-011, REQ-RUT-012
import { describe, expect, test, beforeEach } from 'vitest'
import {
  fetchRutinasByAlumno,
  saveRutinaCompleta,
  removeRutina,
} from '@/services/rutinasService'
import { validateRutinaPayload } from '@/services/validators/rutinasValidator'
import { checkDisponibilidadEquipamiento } from '@/features/rutinas/utils/equipamientoChecker'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('rutinasService & equipamientoChecker (Mock Provider)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('validateRutinaPayload: valida id_alumno, rango de dias (1-7) y lista de ejercicios', () => {
    expect(validateRutinaPayload(null).ok).toBe(false)
    expect(validateRutinaPayload({ id_alumno: null }).ok).toBe(false)
    expect(validateRutinaPayload({ id_alumno: 1, numero_dia: 0, nombre_rutina: 'Torso' }).ok).toBe(false)
    expect(validateRutinaPayload({ id_alumno: 1, numero_dia: 8, nombre_rutina: 'Torso' }).ok).toBe(false)
    expect(validateRutinaPayload({ id_alumno: 1, numero_dia: 1, nombre_rutina: '' }).ok).toBe(false)

    expect(
      validateRutinaPayload({
        id_alumno: 1,
        numero_dia: 1,
        nombre_rutina: 'Torso',
        ejercicios: [{ id_ejercicio: 1, series_objetivo: 0, repeticiones_objetivo: '10' }],
      }).ok
    ).toBe(false)

    expect(
      validateRutinaPayload({
        id_alumno: 1,
        numero_dia: 1,
        nombre_rutina: 'Torso',
        ejercicios: [{ id_ejercicio: 1, series_objetivo: 3, repeticiones_objetivo: '10-12' }],
      }).ok
    ).toBe(true)
  })

  test('checkDisponibilidadEquipamiento: detecta disponibilidad y emite advertencia preventiva', () => {
    const ejercicioSinMaquina = { requiere_equipamiento: false }
    expect(checkDisponibilidadEquipamiento(ejercicioSinMaquina, null)).toEqual({
      disponible: true,
      advertencia: false,
      mensaje: null,
    })

    const ejercicioConMaquina = {
      requiere_equipamiento: true,
      id_equipamiento_requerido: 1,
      equipamiento_requerido: { nombre: 'Banco Plano' },
    }

    const sinSede = checkDisponibilidadEquipamiento(ejercicioConMaquina, null)
    expect(sinSede.disponible).toBe(false)
    expect(sinSede.advertencia).toBe(true)

    const gimnasioSinBanco = {
      nombre: 'Sede Centro',
      equipamiento_disponible: [{ id_equipamiento: 2, estado: true }],
    }
    const faltaBanco = checkDisponibilidadEquipamiento(ejercicioConMaquina, gimnasioSinBanco)
    expect(faltaBanco.disponible).toBe(false)
    expect(faltaBanco.advertencia).toBe(true)

    const gimnasioConBanco = {
      nombre: 'Sede Norte',
      equipamiento_disponible: [{ id_equipamiento: 1, estado: true }],
    }
    const disponible = checkDisponibilidadEquipamiento(ejercicioConMaquina, gimnasioConBanco)
    expect(disponible.disponible).toBe(true)
    expect(disponible.advertencia).toBe(false)
  })

  test('fetchRutinasByAlumno & saveRutinaCompleta: guarda, actualiza y recupera rutina', async () => {
    const rutinasIniciales = await fetchRutinasByAlumno(2)
    expect(Array.isArray(rutinasIniciales)).toBe(true)

    const payload = {
      id_alumno: 2,
      numero_dia: 3,
      nombre_rutina: 'Día 3 - Piernas y Core',
      ejercicios: [
        { id_ejercicio: 1, series_objetivo: 4, repeticiones_objetivo: '8-10', notas_profesor: 'Pesado' },
        { id_ejercicio: 1, series_objetivo: 2, repeticiones_objetivo: '15', notas_profesor: 'Drop set' },
      ],
    }

    const saveRes = await saveRutinaCompleta(payload)
    expect(saveRes.ok).toBe(true)
    expect(saveRes.data.numero_dia).toBe(3)

    const rutinasActualizadas = await fetchRutinasByAlumno(2)
    const rutinaDia3 = rutinasActualizadas.find((r) => r.numero_dia === 3)
    expect(rutinaDia3).toBeDefined()
    expect(rutinaDia3.nombre_rutina).toBe('Día 3 - Piernas y Core')
    expect(rutinaDia3.ejercicios.length).toBe(2)
    expect(rutinaDia3.ejercicios[0].orden).toBe(1)
    expect(rutinaDia3.ejercicios[1].orden).toBe(2)
  })

  test('removeRutina: desactiva la rutina logicamente', async () => {
    const rutinas = await fetchRutinasByAlumno(2)
    expect(rutinas.length).toBeGreaterThan(0)
    const rutinaId = rutinas[0].id

    const delRes = await removeRutina(rutinaId)
    expect(delRes.ok).toBe(true)

    const rutinasDespues = await fetchRutinasByAlumno(2)
    const existe = rutinasDespues.some((r) => r.id === rutinaId)
    expect(existe).toBe(false)
  })
})
