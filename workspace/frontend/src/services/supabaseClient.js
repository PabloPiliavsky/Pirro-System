// Anchored to REQ-FND-003, REQ-FND-010, REQ-FND-011
import { createClient } from '@supabase/supabase-js'

let cachedClient = null

export function getSupabaseClient() {
  if (cachedClient) return cachedClient

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-placeholder-key'

  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return cachedClient
}
