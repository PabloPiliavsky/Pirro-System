// Anchored to REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-003, REQ-AUTH-004, REQ-AUTH-005
import { createInitialMockDb } from '../seed/mockSeedData'
import { MOCK_DB_STORAGE_KEY } from './mockAdapter'
import {
  findUserByIdentifier,
  validatePassword,
  buildAuthUser,
  generateMockSession,
} from './mockAuthHelpers'

export const MOCK_AUTH_STORAGE_KEY = 'pirro_auth_session'
const authListeners = new Set()

function getMockDb() {
  const raw = localStorage.getItem(MOCK_DB_STORAGE_KEY)
  return raw ? JSON.parse(raw) : createInitialMockDb()
}

function updateLastAccess(db, usuarioId) {
  const user = db.usuarios.find((u) => u.id === usuarioId)
  if (user) {
    user.ultimo_acceso = new Date().toISOString()
    localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(db))
  }
}

function notify(event, session) {
  authListeners.forEach((fn) => {
    try {
      fn(event, session)
    } catch (e) {
      console.error('Error en listener de auth', e)
    }
  })
}

export const mockAuthAdapter = {
  mode: 'mock',

  async login({ identifier, password }) {
    if (!identifier || !password) {
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.' } }
    }
    const db = getMockDb()
    const usuario = findUserByIdentifier(db.usuarios, identifier)
    if (!usuario) {
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.' } }
    }
    if (!usuario.estado) {
      return { ok: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Tu cuenta se encuentra deshabilitada. Comunicate con tu profesor.' } }
    }
    const persona = db.personas.find((p) => p.id_usuario === usuario.id)
    if (!persona || !persona.estado) {
      return { ok: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Tu cuenta se encuentra deshabilitada. Comunicate con tu profesor.' } }
    }
    if (!validatePassword(usuario, password)) {
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.' } }
    }
    const user = buildAuthUser(usuario, persona, db)
    const session = generateMockSession(user)
    updateLastAccess(db, usuario.id)
    localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session))
    notify('SIGN_IN', session)
    return { ok: true, session, user }
  },

  async logout() {
    localStorage.removeItem(MOCK_AUTH_STORAGE_KEY)
    notify('SIGN_OUT', null)
    return { ok: true }
  },

  async getCurrentSession() {
    const raw = localStorage.getItem(MOCK_AUTH_STORAGE_KEY)
    if (!raw) return null
    try {
      const session = JSON.parse(raw)
      if (new Date(session.expiresAt) <= new Date()) {
        localStorage.removeItem(MOCK_AUTH_STORAGE_KEY)
        return null
      }
      return { session, user: session.user }
    } catch {
      localStorage.removeItem(MOCK_AUTH_STORAGE_KEY)
      return null
    }
  },

  onAuthStateChange(callback) {
    authListeners.add(callback)
    return {
      unsubscribe: () => authListeners.delete(callback),
    }
  },
}
