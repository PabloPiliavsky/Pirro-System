// Anchored to REQ-FND-011, REQ-FND-012, REQ-FND-015
import { describe, expect, test } from 'vitest'
import { mockAdapter } from '@/services/adapters/mockAdapter'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'

describe('Paridad de Contrato entre mockAdapter y supabaseAdapter', () => {
  test('REQ-FND-011: Ambos adaptadores exponen exactamente los mismos métodos públicos', () => {
    const mockKeys = Object.keys(mockAdapter).sort()
    const supabaseKeys = Object.keys(supabaseAdapter).sort()
    expect(mockKeys).toEqual(supabaseKeys)

    for (const key of mockKeys) {
      if (key !== 'mode') {
        expect(typeof mockAdapter[key]).toBe('function')
        expect(typeof supabaseAdapter[key]).toBe('function')
      }
    }
  })

  test('REQ-FND-012: Ambos adaptadores devuelven el mismo error estructurado ante un payload batch inválido', async () => {
    const invalidPayload = { clientSubmissionId: null, idAlumno: null, idRutina: 1, series: [] }

    const mockResponse = await mockAdapter.guardarEntrenamientoBatch(invalidPayload)
    const supabaseResponse = await supabaseAdapter.guardarEntrenamientoBatch(invalidPayload)

    expect(mockResponse).toEqual(supabaseResponse)
    expect(mockResponse.ok).toBe(false)
    expect(mockResponse.error.code).toBe('INVALID_BATCH_PAYLOAD')
  })
})
