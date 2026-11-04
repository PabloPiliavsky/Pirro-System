// Anchored to REQ-FND-010, REQ-FND-011
// TODO: [MOCK-CLEANUP] Retirar soporte dual mock/supabase y eliminar referencias a mockAdapter una vez migrado 100% a Supabase.
import { mockAdapter } from './adapters/mockAdapter' // TODO: [MOCK-CLEANUP] Eliminar import de mockAdapter
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
  // TODO: [MOCK-CLEANUP] Eliminar fallback a 'mock' cuando se use exclusivamente Supabase
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
  // TODO: [MOCK-CLEANUP] Retirar fallback a mockAdapter cuando Supabase sea el único proveedor activo
  return getActiveDataMode() === 'supabase' ? supabaseAdapter : mockAdapter
}
