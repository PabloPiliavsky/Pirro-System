// Anchored to REQ-FND-013, REQ-FND-015
import { act, renderHook } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import {
  getDraftStorageKey,
  useRoutineLocalStorage,
} from '@/features/training/hooks/useRoutineLocalStorage'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('Hook useRoutineLocalStorage — Sincronización Offline-First y Guardado Batch', () => {
  test('REQ-FND-013: Persiste series en localStorage con 0 llamadas al adaptador de datos', () => {
    const batchSpy = vi.spyOn(mockAdapter, 'guardarEntrenamientoBatch')
    const { result } = renderHook(() => useRoutineLocalStorage(2, 1))

    act(() => {
      result.current.saveSerieDraft({
        idEjercicio: 1,
        numeroSerie: 1,
        repeticionesObjetivo: '8-10',
        repeticionesRealizadas: 10,
        pesoUtilizado: 32.5,
      })
      result.current.saveSerieDraft({
        idEjercicio: 1,
        numeroSerie: 2,
        repeticionesObjetivo: '8-10',
        repeticionesRealizadas: 9,
        pesoUtilizado: 35,
      })
    })

    expect(batchSpy).not.toHaveBeenCalled()
    expect(result.current.draft.series).toHaveLength(2)

    const stored = JSON.parse(localStorage.getItem(getDraftStorageKey(2, 1)))
    expect(stored.series).toHaveLength(2)
    batchSpy.mockRestore()
  })

  test('REQ-FND-013: commitBatch envía 1 única transacción y limpia el borrador si tiene éxito', async () => {
    const batchSpy = vi.spyOn(mockAdapter, 'guardarEntrenamientoBatch')
    const { result } = renderHook(() => useRoutineLocalStorage(2, 1))

    act(() => {
      result.current.saveSerieDraft({
        idEjercicio: 1,
        numeroSerie: 1,
        repeticionesRealizadas: 10,
        pesoUtilizado: 40,
      })
    })

    let response
    await act(async () => {
      response = await result.current.commitBatch()
    })

    expect(batchSpy).toHaveBeenCalledTimes(1)
    expect(response.ok).toBe(true)
    expect(result.current.draft.series).toHaveLength(0)
    batchSpy.mockRestore()
  })

  test('REQ-FND-013: Preserva el borrador en localStorage si el guardado falla', async () => {
    const { result } = renderHook(() => useRoutineLocalStorage(2, 1))

    let response
    await act(async () => {
      response = await result.current.commitBatch()
    })

    expect(response.ok).toBe(false)
    expect(localStorage.getItem(getDraftStorageKey(2, 1))).not.toBeNull()
  })
})
