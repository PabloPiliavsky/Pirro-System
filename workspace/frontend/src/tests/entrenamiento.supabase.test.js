// Anchored to REQ-TRN-001, REQ-TRN-007, REQ-TRN-009, REQ-TRN-011, REQ-TRN-012
import { describe, expect, test, beforeEach, afterAll } from 'vitest'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'

const isSupabaseEnabled = process.env.RUN_SUPABASE_TESTS === 'true'
const runIfSupabase = isSupabaseEnabled ? describe : describe.skip

runIfSupabase('supabaseAdapter - Planilla y Entrenamiento Batch (Docker Supabase)', () => {
  beforeEach(async () => {
    await supabaseAuthAdapter.login({
      identifier: 'martin.gomez@alumno.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await supabaseAuthAdapter.logout()
  })

  test('REQ-TRN-001: getRutinasByAlumno recupera rutinas asignadas y ejercicios relacionales', async () => {
    const rutinas = await supabaseAdapter.getRutinasByAlumno(2)
    expect(Array.isArray(rutinas)).toBe(true)
    expect(rutinas.length).toBeGreaterThan(0)
    const r = rutinas[0]
    expect(r.id_alumno).toBe(2)
    expect(Array.isArray(r.ejercicios)).toBe(true)
  })

  test('REQ-TRN-007, REQ-TRN-011: guardarEntrenamientoBatch ejecuta RPC transaccional e idempotente', async () => {
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
          repeticionesObjetivo: '8-10',
          repeticionesRealizadas: 10,
          pesoUtilizado: 34,
          comentarioAlumno: 'Live Docker Test Serie 1',
        },
        {
          idEjercicio: 1,
          numeroSerie: 2,
          repeticionesObjetivo: '8-10',
          repeticionesRealizadas: 9,
          pesoUtilizado: 34,
          comentarioAlumno: null,
        },
      ],
    }

    const res = await supabaseAdapter.guardarEntrenamientoBatch(payload)
    expect(res.ok).toBe(true)
    expect(res.idempotent).toBe(false)
    expect(res.idRegistro).toBeDefined()

    // Test Idempotencia en Postgres
    const resIdem = await supabaseAdapter.guardarEntrenamientoBatch(payload)
    expect(resIdem.ok).toBe(true)
    expect(resIdem.idempotent).toBe(true)
    expect(resIdem.idRegistro).toBe(res.idRegistro)
  })

  test('REQ-TRN-009, REQ-TRN-011: getHistorialByAlumno consulta registros y series relacionales desde Postgres', async () => {
    const historial = await supabaseAdapter.getHistorialByAlumno(2)
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
