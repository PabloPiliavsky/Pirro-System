import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'

const isSupabaseEnabled = process.env.RUN_SUPABASE_TESTS === 'true'
const runIfSupabase = isSupabaseEnabled ? describe : describe.skip

runIfSupabase('supabaseAdapter - Gimnasios y Ejercicios (Docker Supabase)', () => {
  beforeEach(async () => {
    await supabaseAuthAdapter.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await supabaseAuthAdapter.logout()
  })
  test('REQ-GYM-001: getGimnasios y getEquipamientoMaestro retornan datos relacionales reales', async () => {
    const [gyms, equipamiento] = await Promise.all([
      supabaseAdapter.getGimnasios(),
      supabaseAdapter.getEquipamientoMaestro(),
    ])

    expect(Array.isArray(gyms)).toBe(true)
    expect(gyms.length).toBeGreaterThan(0)
    expect(gyms[0]).toHaveProperty('id')
    expect(gyms[0]).toHaveProperty('nombre')
    expect(gyms[0]).toHaveProperty('equipamiento_disponible')

    expect(Array.isArray(equipamiento)).toBe(true)
    expect(equipamiento.length).toBeGreaterThan(0)
  })

  test('REQ-GYM-002, REQ-GYM-005: guardarGimnasio y eliminarGimnasio operan en Postgres', async () => {
    const payload = {
      nombre: 'Sede Supabase Live Test',
      direccion: 'Calle Falsa 123',
      horario_apertura: '06:00',
      horario_cierre: '22:00',
      estado: true,
      equipamientoIds: [1, 2],
    }

    const res = await supabaseAdapter.guardarGimnasio(payload)
    expect(res.ok).toBe(true)
    expect(res.data.id).toBeDefined()

    const gyms = await supabaseAdapter.getGimnasios()
    const created = gyms.find((g) => g.id === res.data.id)
    expect(created).toBeDefined()
    expect(created.equipamiento_disponible.length).toBe(2)

    const delRes = await supabaseAdapter.eliminarGimnasio(res.data.id)
    expect(delRes.ok).toBe(true)

    const gymsAfter = await supabaseAdapter.getGimnasios()
    const deleted = gymsAfter.find((g) => g.id === res.data.id)
    expect(deleted.estado).toBe(false)
  })

  test('REQ-EJE-001, REQ-EJE-002, REQ-EJE-005: getEjercicios, guardarEjercicio y eliminarEjercicio operan en Postgres', async () => {
    const ejercicios = await supabaseAdapter.getEjercicios()
    expect(Array.isArray(ejercicios)).toBe(true)
    expect(ejercicios.length).toBeGreaterThan(0)

    const payload = {
      nombre: 'Remo Gironda Supabase Test',
      grupo_muscular: 'Espalda',
      requiere_equipamiento: true,
      id_equipamiento_requerido: 3,
      indicaciones: 'Codos pegados al torso',
      url_video: 'https://youtube.com',
      estado: true,
    }

    const saveRes = await supabaseAdapter.guardarEjercicio(payload)
    expect(saveRes.ok).toBe(true)
    expect(saveRes.data.id).toBeDefined()

    const ejsAfter = await supabaseAdapter.getEjercicios()
    const created = ejsAfter.find((e) => e.id === saveRes.data.id)
    expect(created).toBeDefined()
    expect(created.equipamiento_requerido).toBeDefined()

    const delRes = await supabaseAdapter.eliminarEjercicio(saveRes.data.id)
    expect(delRes.ok).toBe(true)

    const ejsFinal = await supabaseAdapter.getEjercicios()
    const deleted = ejsFinal.find((e) => e.id === saveRes.data.id)
    expect(deleted.estado).toBe(false)
  })
})
