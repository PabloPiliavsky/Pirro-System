// Anchored to REQ-AUTH-002
// TODO: [MOCK-CLEANUP] Retirar soporte para mockAuthAdapter cuando se complete la migración a Supabase Auth.
import { getActiveDataMode } from './dataProvider'
import { mockAuthAdapter } from './adapters/mockAuthAdapter' // TODO: [MOCK-CLEANUP] Eliminar import de mockAuthAdapter
import { supabaseAuthAdapter } from './adapters/supabaseAuthAdapter'

export function getAuthAdapter() {
  // TODO: [MOCK-CLEANUP] Retirar fallback a mockAuthAdapter
  return getActiveDataMode() === 'supabase' ? supabaseAuthAdapter : mockAuthAdapter
}

export const authService = {
  async login(credentials) {
    return getAuthAdapter().login(credentials)
  },

  async logout() {
    return getAuthAdapter().logout()
  },

  async getCurrentSession() {
    return getAuthAdapter().getCurrentSession()
  },

  onAuthStateChange(callback) {
    return getAuthAdapter().onAuthStateChange(callback)
  },
}
