// Anchored to REQ-RUT-001, REQ-RUT-003, REQ-RUT-011, REQ-RUT-012
import { describe, expect, test, beforeEach, afterAll } from 'vitest'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'

const isSupabaseEnabled = process.env.RUN_SUPABASE_TESTS === 'true'
const runIfSupabase = isSupabaseEnabled ? describe : describe.skip

runIfSupabase('supabaseAdapter - Constructor de Rutinas (Docker Supabase)', () => {
  beforeEach(async () => {
    await supabaseAuthAdapter.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await supabaseAuthAdapter.logout()
  })

  test('REQ-RUT-001: getRutinasByAlumno recupera rutinas relacionales con ejercicios', async () => {
    const rutinas = await supabaseAdapter.getRutinasByAlumno(2)
    expect(Array.isArray(rutinas)).toBe(true)

    if (rutinas.length > 0) {
      const primera = rutinas[0]
      expect(primera).toHaveProperty('id')
      expect(primera).toHaveProperty('nombre_rutina')
      expect(primera).toHaveProperty('numero_dia')
      expect(Array.isArray(primera.ejercicios)).toBe(true)
    }
  })

  test('REQ-RUT-001, REQ-RUT-003, REQ-RUT-011: guardarRutinaCompleta persiste cabecera y ejercicios en Postgres', async () => {
    const payload = {
      id_alumno: 2,
      numero_dia: 2,
      nombre_rutina: 'Día 2 - Espalda y Bíceps Live',
      ejercicios: [
        {
          id_ejercicio: 2,
          series_objetivo: 4,
          repeticiones_objetivo: '8-10',
          notas_profesor: 'Cuidar retracción escapular',
        },
        {
          id_ejercicio: 2,
          series_objetivo: 3,
          repeticiones_objetivo: '12',
          notas_profesor: 'Serie de congestión',
        },
      ],
    }

    const res = await supabaseAdapter.guardarRutinaCompleta(payload)
    expect(res.ok).toBe(true)
    expect(res.data.id).toBeDefined()
    expect(res.data.numero_dia).toBe(2)

    const rutinasActualizadas = await supabaseAdapter.getRutinasByAlumno(2)
    const rutinaDia2 = rutinasActualizadas.find((r) => r.numero_dia === 2)
    expect(rutinaDia2).toBeDefined()
    expect(rutinaDia2.nombre_rutina).toBe('Día 2 - Espalda y Bíceps Live')
    expect(rutinaDia2.ejercicios.length).toBe(2)
    expect(rutinaDia2.ejercicios[0].orden).toBe(1)
    expect(rutinaDia2.ejercicios[1].orden).toBe(2)
  })

  test('REQ-RUT-011: eliminarRutina desactiva logicamente la rutina en Postgres', async () => {
    const payload = {
      id_alumno: 2,
      numero_dia: 5,
      nombre_rutina: 'Día 5 - Rutina Temporal',
      ejercicios: [{ id_ejercicio: 1, series_objetivo: 3, repeticiones_objetivo: '10' }],
    }

    const guardada = await supabaseAdapter.guardarRutinaCompleta(payload)
    expect(guardada.ok).toBe(true)

    const delRes = await supabaseAdapter.eliminarRutina(guardada.data.id)
    expect(delRes.ok).toBe(true)

    const rutinas = await supabaseAdapter.getRutinasByAlumno(2)
    const activa = rutinas.some((r) => r.id === guardada.data.id)
    expect(activa).toBe(false)
  })
})
