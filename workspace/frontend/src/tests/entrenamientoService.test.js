// Anchored to REQ-TRN-001, REQ-TRN-007, REQ-TRN-008, REQ-TRN-009, REQ-TRN-011
import { describe, expect, test, beforeEach } from 'vitest'
import {
  getRutinasAlumno,
  guardarBatch,
  getHistorialAlumno,
} from '@/services/entrenamientoService'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('entrenamientoService (Mock Provider)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('REQ-TRN-001: getRutinasAlumno recupera las rutinas activas del alumno', async () => {
    const rutinas = await getRutinasAlumno(2)
    expect(Array.isArray(rutinas)).toBe(true)
    expect(rutinas.length).toBeGreaterThan(0)
    const r1 = rutinas[0]
    expect(r1.id_alumno).toBe(2)
    expect(Array.isArray(r1.ejercicios)).toBe(true)
  })

  test('REQ-TRN-008: guardarBatch rechaza payloads sin series o con datos invalidos', async () => {
    const resVacio = await guardarBatch({
      clientSubmissionId: crypto.randomUUID(),
      idAlumno: 2,
      idRutina: 1,
      fechaRealizacion: '2026-11-11',
      series: [],
    })
    expect(resVacio.ok).toBe(false)

    const resInvalido = await guardarBatch({
      clientSubmissionId: crypto.randomUUID(),
      idAlumno: 2,
      idRutina: 1,
      fechaRealizacion: '2026-11-11',
      series: [
        {
          idEjercicio: 1,
          numeroSerie: 1,
          repeticionesObjetivo: '10',
          repeticionesRealizadas: -1,
          pesoUtilizado: 20,
        },
      ],
    })
    expect(resInvalido.ok).toBe(false)
  })

  test('REQ-TRN-007: guardarBatch persiste la sesion y soporta idempotencia', async () => {
    const subId = crypto.randomUUID()
    const payload = {
      clientSubmissionId: subId,
      idAlumno: 2,
      idRutina: 1,
      fechaRealizacion: '2026-11-11',
      series: [
        {
          idEjercicio: 1,
          numeroSerie: 1,
          repeticionesObjetivo: '10',
          repeticionesRealizadas: 10,
          pesoUtilizado: 30,
          comentarioAlumno: 'Excelente bombeo',
        },
      ],
    }

    const res = await guardarBatch(payload)
    expect(res.ok).toBe(true)
    expect(res.idempotent).toBe(false)

    // Reenvío idempotente
    const resIdem = await guardarBatch(payload)
    expect(resIdem.ok).toBe(true)
    expect(resIdem.idempotent).toBe(true)
  })

  test('REQ-TRN-009: getHistorialAlumno recupera sesiones con rutina y ejercicios', async () => {
    const historial = await getHistorialAlumno(2)
    expect(Array.isArray(historial)).toBe(true)
    expect(historial.length).toBeGreaterThan(0)
    const sesion = historial[0]
    expect(sesion).toHaveProperty('fecha_realizacion')
    expect(sesion).toHaveProperty('rutina')
    expect(sesion).toHaveProperty('series')
    expect(sesion.series.length).toBeGreaterThan(0)
    expect(sesion.series[0].ejercicio).toBeDefined()
  })
})
