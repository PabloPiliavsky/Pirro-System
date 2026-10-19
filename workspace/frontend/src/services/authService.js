// Anchored to REQ-AUTH-002
import { getActiveDataMode } from './dataProvider'
import { mockAuthAdapter } from './adapters/mockAuthAdapter'
import { supabaseAuthAdapter } from './adapters/supabaseAuthAdapter'

export function getAuthAdapter() {
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
