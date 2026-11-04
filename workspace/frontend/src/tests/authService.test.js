// Anchored to REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-003, REQ-AUTH-004, REQ-AUTH-005, REQ-AUTH-014
import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from '@/services/authService'
import { mockAuthAdapter, MOCK_AUTH_STORAGE_KEY } from '@/services/adapters/mockAuthAdapter'
import { MOCK_DB_STORAGE_KEY } from '@/services/adapters/mockAdapter'
import { createInitialMockDb } from '@/services/seed/mockSeedData'

describe('Servicio de Autenticación Dual (Mock Adapter)', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(createInitialMockDb()))
  })

  it('REQ-AUTH-001 / REQ-AUTH-002: Inicia sesión de profesor exitosamente mediante email', async () => {
    const res = await authService.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'demo123',
    })
    expect(res.ok).toBe(true)
    expect(res.user.rol).toBe('profesor')
    expect(res.user.nombre).toBe('Leandro')
    expect(res.session.token).toBeDefined()
    expect(localStorage.getItem(MOCK_AUTH_STORAGE_KEY)).toBeTruthy()
  })

  it('REQ-AUTH-001 / REQ-AUTH-002: Inicia sesión de profesor exitosamente mediante nombre_usuario', async () => {
    const res = await authService.login({
      identifier: 'leandro.pirro',
      password: 'demo123',
    })
    expect(res.ok).toBe(true)
    expect(res.user.rol).toBe('profesor')
    expect(res.user.id_usuario).toBe(1)
  })

  it('REQ-AUTH-001: Inicia sesión de alumno por nombre_usuario y resuelve gimnasio asociado', async () => {
    const res = await authService.login({
      identifier: 'martin.gomez',
      password: 'demo123',
    })
    expect(res.ok).toBe(true)
    expect(res.user.rol).toBe('alumno')
    expect(res.user.nombre).toBe('Martín')
    expect(res.user.id_gimnasio).toBe(1)
    expect(res.user.nombre_gimnasio).toBe('Iron Temple Palermo')
  })

  it('REQ-AUTH-004: Rechaza credenciales incorrectas con INVALID_CREDENTIALS', async () => {
    const res = await authService.login({
      identifier: 'leandro.pirro',
      password: 'password_invalida_xyz',
    })
    expect(res.ok).toBe(false)
    expect(res.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('REQ-AUTH-004: Rechaza usuario inexistente con INVALID_CREDENTIALS', async () => {
    const res = await authService.login({
      identifier: 'no_existe_usuario',
      password: 'demo123',
    })
    expect(res.ok).toBe(false)
    expect(res.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('REQ-AUTH-003: Bloquea cuentas inactivas con ACCOUNT_INACTIVE', async () => {
    const db = createInitialMockDb()
    db.usuarios[1].estado = false // Deshabilitar alumno Martín
    localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(db))

    const res = await authService.login({
      identifier: 'martin.gomez',
      password: 'demo123',
    })
    expect(res.ok).toBe(false)
    expect(res.error.code).toBe('ACCOUNT_INACTIVE')
  })

  it('REQ-AUTH-002 / REQ-AUTH-005: Recupera la sesión actual y la destruye en logout', async () => {
    await authService.login({
      identifier: 'leandro.pirro',
      password: 'demo123',
    })

    const sessionRes = await authService.getCurrentSession()
    expect(sessionRes).not.toBeNull()
    expect(sessionRes.user.nombre_usuario).toBe('leandro.pirro')

    const logoutRes = await authService.logout()
    expect(logoutRes.ok).toBe(true)
    expect(await authService.getCurrentSession()).toBeNull()
    expect(localStorage.getItem(MOCK_AUTH_STORAGE_KEY)).toBeNull()
  })

  it('REQ-AUTH-002: Notifica a los observadores mediante onAuthStateChange', async () => {
    const events = []
    const sub = authService.onAuthStateChange((event, session) => {
      events.push({ event, session })
    })

    await authService.login({ identifier: 'leandro.pirro', password: 'demo123' })
    await authService.logout()
    sub.unsubscribe()

    expect(events.length).toBe(2)
    expect(events[0].event).toBe('SIGN_IN')
    expect(events[1].event).toBe('SIGN_OUT')
  })
})
