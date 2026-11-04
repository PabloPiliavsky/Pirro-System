// Anchored to REQ-AUTH-002, REQ-AUTH-015
import { describe, it, expect, beforeAll } from 'vitest'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'

const runSupabaseTests = process.env.RUN_SUPABASE_TESTS === 'true'

describe.skipIf(!runSupabaseTests)('Pruebas de Integración Supabase Auth (En Vivo)', () => {
  beforeAll(async () => {
    await supabaseAuthAdapter.logout()
  })

  it('REQ-AUTH-002: Inicia sesión en Supabase con email del profesor y obtiene sesión real', async () => {
    const res = await supabaseAuthAdapter.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'password123',
    })
    expect(res.ok).toBe(true)
    expect(res.user.rol).toBe('profesor')
    expect(res.session.token).toBeDefined()
  })

  it('REQ-AUTH-001 / REQ-AUTH-015: Inicia sesión resolviendo nombre_usuario vía RPC', async () => {
    const res = await supabaseAuthAdapter.login({
      identifier: 'martin.gomez',
      password: 'password123',
    })
    expect(res.ok).toBe(true)
    expect(res.user.rol).toBe('alumno')
    expect(res.user.id_gimnasio).toBeDefined()
  })

  it('REQ-AUTH-002: Cierra la sesión en Supabase Auth', async () => {
    const logoutRes = await supabaseAuthAdapter.logout()
    expect(logoutRes.ok).toBe(true)

    const sessionRes = await supabaseAuthAdapter.getCurrentSession()
    expect(sessionRes).toBeNull()
  })
})
