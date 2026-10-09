// =============================================================================
// PIRRO-SYSTEM — SUITE DE INTEGRACIÓN Y PARIDAD CONTRA SUPABASE REAL / DOCKER
// Anchored to REQ-FND-004, REQ-FND-007, REQ-FND-008, REQ-FND-011, REQ-FND-016
// Se omite automáticamente cuando se trabaja sin Docker (!process.env.RUN_SUPABASE_TESTS)
// y se ejecuta en vivo al correr: npm run test:supabase
// =============================================================================
import { describe, expect, test } from 'vitest'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { mockAdapter } from '@/services/adapters/mockAdapter'

const runSupabaseIntegration = Boolean(process.env.RUN_SUPABASE_TESTS)

describe.skipIf(!runSupabaseIntegration)(
  'Integración Real Supabase PostgreSQL, RLS y RPC guardar_entrenamiento_batch',
  () => {
    test('REQ-FND-004 & REQ-FND-011: Paridad estructural entre supabaseAdapter y mockAdapter en getAlumnos()', async () => {
      const [supabaseAlumnos, mockAlumnos] = await Promise.all([
        supabaseAdapter.getAlumnos(),
        mockAdapter.getAlumnos(),
      ])

      expect(supabaseAlumnos.length).toBeGreaterThanOrEqual(mockAlumnos.length)
      expect(Object.keys(supabaseAlumnos[0]).sort()).toEqual(
        Object.keys(mockAlumnos[0]).sort()
      )
    })

    test('REQ-FND-008: La función RPC guardar_entrenamiento_batch inserta en bloque y garantiza idempotencia', async () => {
      const uniqueSubmissionId = crypto.randomUUID()
      const payload = {
        clientSubmissionId: uniqueSubmissionId,
        idAlumno: 2,
        idRutina: 1,
        fechaRealizacion: '2026-10-08',
        series: [
          {
            idEjercicio: 1,
            numeroSerie: 1,
            repeticionesObjetivo: '8-10',
            repeticionesRealizadas: 10,
            pesoUtilizado: 32.5,
            comentarioAlumno: 'Test integración Supabase RPC',
          },
        ],
      }

      const firstResponse = await supabaseAdapter.guardarEntrenamientoBatch(payload)
      expect(firstResponse.ok).toBe(true)
      expect(firstResponse.idempotent).toBe(false)
      expect(firstResponse.idRegistro).toBeDefined()

      const secondResponse = await supabaseAdapter.guardarEntrenamientoBatch(payload)
      expect(secondResponse.ok).toBe(true)
      expect(secondResponse.idempotent).toBe(true)
      expect(secondResponse.idRegistro).toBe(firstResponse.idRegistro)
    })
  }
)
