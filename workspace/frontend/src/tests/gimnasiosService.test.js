// Anchored to REQ-GYM-001, REQ-GYM-002, REQ-GYM-004, REQ-GYM-005, REQ-GYM-009
import { describe, expect, test, beforeEach } from 'vitest'
import {
  fetchGimnasios,
  fetchEquipamientoMaestro,
  saveGimnasio,
  removeGimnasio,
} from '@/services/gimnasiosService'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('gimnasiosService (Mock Provider)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('fetchGimnasios retorna sedes con su equipamiento asignado', async () => {
    const gyms = await fetchGimnasios()
    expect(gyms.length).toBeGreaterThan(0)
    expect(gyms[0]).toHaveProperty('id')
    expect(gyms[0]).toHaveProperty('nombre')
    expect(gyms[0]).toHaveProperty('equipamiento_disponible')
  })

  test('fetchEquipamientoMaestro retorna el catálogo de máquinas', async () => {
    const eq = await fetchEquipamientoMaestro()
    expect(eq.length).toBeGreaterThan(0)
    expect(eq[0]).toHaveProperty('id')
    expect(eq[0]).toHaveProperty('nombre')
  })

  test('saveGimnasio valida payload y crea una nueva sede', async () => {
    const invalid = await saveGimnasio({ nombre: '' })
    expect(invalid.ok).toBe(false)
    expect(invalid.error.code).toBe('INVALID_GIMNASIO_PAYLOAD')

    const validPayload = {
      nombre: 'Sede Norte Test',
      direccion: 'Av. Libertador 5000',
      horario_apertura: '07:00',
      horario_cierre: '23:00',
      estado: true,
      equipamientoIds: [1, 2],
    }

    const created = await saveGimnasio(validPayload)
    expect(created.ok).toBe(true)
    expect(created.data.id).toBeDefined()
    expect(created.data.nombre).toBe('Sede Norte Test')

    const gyms = await fetchGimnasios()
    const found = gyms.find((g) => g.id === created.data.id)
    expect(found).toBeDefined()
    expect(found.equipamiento_disponible.length).toBe(2)
  })

  test('removeGimnasio realiza baja lógica de la sede', async () => {
    const gymsBefore = await fetchGimnasios()
    const target = gymsBefore[0]

    const res = await removeGimnasio(target.id)
    expect(res.ok).toBe(true)

    const gymsAfter = await fetchGimnasios()
    const updated = gymsAfter.find((g) => g.id === target.id)
    expect(updated.estado).toBe(false)
  })
})
