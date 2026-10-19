// Anchored to REQ-FND-010, REQ-FND-011
import { mockAdapter } from './adapters/mockAdapter'
import { supabaseAdapter } from './adapters/supabaseAdapter'

export const DEV_DATA_MODE_STORAGE_KEY = 'pirro_dev_data_mode'

export function getActiveDataMode() {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    const devOverride = window.localStorage.getItem(DEV_DATA_MODE_STORAGE_KEY)
    if (devOverride === 'mock' || devOverride === 'supabase') {
      return devOverride
    }
  }
  const envMode = import.meta.env.VITE_DATA_MODE
  return envMode === 'supabase' ? 'supabase' : 'mock'
}

export function setDevDataMode(mode) {
  if (mode !== 'mock' && mode !== 'supabase') {
    throw new Error(`Modo de datos inválido: ${mode}`)
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEV_DATA_MODE_STORAGE_KEY, mode)
  }
  return mode
}

export function getProvider() {
  return getActiveDataMode() === 'supabase' ? supabaseAdapter : mockAdapter
}
