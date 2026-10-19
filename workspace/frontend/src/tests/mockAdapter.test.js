// Anchored to REQ-FND-004, REQ-FND-005, REQ-FND-006, REQ-FND-008, REQ-FND-009, REQ-FND-011, REQ-FND-012, REQ-FND-015
import { describe, expect, test } from 'vitest'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('mockAdapter — Esquema Relacional, Idempotencia y Guardado Batch', () => {
  test('REQ-FND-004 & REQ-FND-009: Hidrata la cadena 1:1:1 usuarios -> personas -> perfil_alumno', async () => {
    const summary = await mockAdapter.getSystemStatusSummary()
    expect(summary.profesor.nombre).toBe('Leandro')
    expect(summary.profesor.rol).toBe('profesor')
    expect(summary.profesor.usuario.nombre_usuario).toBe('leandro.pirro')

    const alumnos = await mockAdapter.getAlumnos()
    expect(alumnos).toHaveLength(2)
    expect(alumnos[0]).toMatchObject({
      id_persona: 2,
      id_profesor: 1,
      id_gimnasio: 1,
      altura_cm: 178,
      peso_kg: 79.5,
      persona: { id: 2, id_usuario: 2, rol: 'alumno', nombre: 'Martín' },
      usuario: { id: 2, nombre_usuario: 'martin.gomez' },
    })
  })

  test('REQ-FND-005 & REQ-FND-006: Devuelve gimnasios con equipamiento, ejercicios y rutinas por alumno', async () => {
    const gimnasios = await mockAdapter.getGimnasios()
    expect(gimnasios).toHaveLength(2)
    expect(gimnasios[0].equipamiento_disponible.length).toBeGreaterThan(0)

    const ejercicios = await mockAdapter.getEjercicios()
    expect(ejercicios).toHaveLength(6)

    const rutinasAlumno2 = await mockAdapter.getRutinasByAlumno(2)
    expect(rutinasAlumno2).toHaveLength(2)
    expect(rutinasAlumno2[0].ejercicios[0].series_objetivo).toBe(4)
  })

  test('REQ-FND-008: guardarEntrenamientoBatch es atómico e idempotente por clientSubmissionId', async () => {
    const payload = {
      clientSubmissionId: '123e4567-e89b-12d3-a456-426614174000',
      idAlumno: 2,
      idRutina: 1,
      fechaRealizacion: '2026-10-08',
      series: [
        { idEjercicio: 1, numeroSerie: 1, repeticionesObjetivo: '8-10', repeticionesRealizadas: 10, pesoUtilizado: 35 },
        { idEjercicio: 1, numeroSerie: 2, repeticionesObjetivo: '8-10', repeticionesRealizadas: 9, pesoUtilizado: 35 },
      ],
    }

    const firstCall = await mockAdapter.guardarEntrenamientoBatch(payload)
    expect(firstCall).toEqual({ ok: true, idRegistro: 2, idempotent: false })

    const secondCall = await mockAdapter.guardarEntrenamientoBatch(payload)
    expect(secondCall).toEqual({ ok: true, idRegistro: 2, idempotent: true })

    const summary = await mockAdapter.getSystemStatusSummary()
    expect(summary.counts.registros_rutina).toBe(2)
    expect(summary.counts.detalle_series).toBe(8)
  })

  test('REQ-FND-012: Rechaza payloads inválidos sin alterar registros_rutina ni detalle_series', async () => {
    const badResult = await mockAdapter.guardarEntrenamientoBatch({
      clientSubmissionId: '',
      idAlumno: 2,
      idRutina: 1,
      series: [],
    })

    expect(badResult.ok).toBe(false)
    expect(badResult.error.code).toBe('INVALID_BATCH_PAYLOAD')

    const summary = await mockAdapter.getSystemStatusSummary()
    expect(summary.counts.registros_rutina).toBe(1)
  })

  test('REQ-FND-011: resetMockDatabase restaura los datos semilla originales', async () => {
    await mockAdapter.guardarEntrenamientoBatch({
      clientSubmissionId: '999e4567-e89b-12d3-a456-426614174999',
      idAlumno: 2,
      idRutina: 1,
      series: [{ idEjercicio: 1, numeroSerie: 1, repeticionesRealizadas: 10, pesoUtilizado: 40 }],
    })
    const resetRes = await mockAdapter.resetMockDatabase()
    expect(resetRes.ok).toBe(true)

    const summary = await mockAdapter.getSystemStatusSummary()
    expect(summary.counts.registros_rutina).toBe(1)
  })
})
