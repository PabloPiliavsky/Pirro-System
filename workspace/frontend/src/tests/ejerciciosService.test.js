// Anchored to REQ-EJE-001, REQ-EJE-002, REQ-EJE-003, REQ-EJE-004, REQ-EJE-005, REQ-GYM-009
import { describe, expect, test, beforeEach } from 'vitest'
import {
  fetchEjercicios,
  saveEjercicio,
  removeEjercicio,
} from '@/services/ejerciciosService'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('ejerciciosService (Mock Provider)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('fetchEjercicios retorna el catálogo completo con relaciones', async () => {
    const list = await fetchEjercicios()
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]).toHaveProperty('nombre')
    expect(list[0]).toHaveProperty('grupo_muscular')
    expect(list[0]).toHaveProperty('requiere_equipamiento')
  })

  test('saveEjercicio valida campos obligatorios y equipamiento condicional', async () => {
    const invalidNoName = await saveEjercicio({ nombre: '', grupo_muscular: 'Espalda' })
    expect(invalidNoName.ok).toBe(false)
    expect(invalidNoName.error.code).toBe('INVALID_EJERCICIO_PAYLOAD')

    const invalidNoEq = await saveEjercicio({
      nombre: 'Jalón al pecho',
      grupo_muscular: 'Espalda',
      requiere_equipamiento: true,
      id_equipamiento_requerido: null,
    })
    expect(invalidNoEq.ok).toBe(false)
    expect(invalidNoEq.error.code).toBe('INVALID_EJERCICIO_PAYLOAD')

    const validPayload = {
      nombre: 'Jalón en polea alta',
      grupo_muscular: 'Espalda',
      requiere_equipamiento: true,
      id_equipamiento_requerido: 3,
      indicaciones: 'Traccionar hasta la barbilla',
      url_video: 'https://youtube.com/watch?v=jalon',
      estado: true,
    }

    const res = await saveEjercicio(validPayload)
    expect(res.ok).toBe(true)
    expect(res.data.id).toBeDefined()
    expect(res.data.nombre).toBe('Jalón en polea alta')

    const list = await fetchEjercicios()
    const created = list.find((e) => e.id === res.data.id)
    expect(created).toBeDefined()
    expect(created.equipamiento_requerido).toBeDefined()
  })

  test('removeEjercicio realiza baja lógica', async () => {
    const listBefore = await fetchEjercicios()
    const target = listBefore[0]

    const res = await removeEjercicio(target.id)
    expect(res.ok).toBe(true)

    const listAfter = await fetchEjercicios()
    const found = listAfter.find((e) => e.id === target.id)
    expect(found.estado).toBe(false)
  })
})
