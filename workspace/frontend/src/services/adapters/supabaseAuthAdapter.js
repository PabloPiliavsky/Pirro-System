// Anchored to REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-003, REQ-AUTH-004, REQ-AUTH-015
import { getSupabaseClient } from '../supabaseClient'

async function resolveEmail(supabase, identifier) {
  const clean = String(identifier).trim()
  if (clean.includes('@')) return clean.toLowerCase()
  const { data, error } = await supabase.rpc('resolve_user_email_by_identifier', {
    p_identifier: clean,
  })
  if (!error && data) return data
  const { data: userRow } = await supabase
    .from('usuarios')
    .select('email')
    .ilike('nombre_usuario', clean)
    .single()
  return userRow?.email || null
}

async function fetchPersonaByAuthUid(supabase, authUid) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select(
      '*, personas(*, perfil_alumno:perfil_alumno!perfil_alumno_id_persona_fkey(*, gimnasio:gimnasios(*)))'
    )
    .eq('auth_user_id', authUid)
    .single()

  if (error || !usuario || !usuario.estado) return null
  const persona = usuario.personas?.[0] || usuario.personas
  if (!persona || !persona.estado) return null

  const perfil = persona.perfil_alumno?.[0] || persona.perfil_alumno
  return {
    id: usuario.id,
    id_usuario: usuario.id,
    id_persona: persona.id,
    nombre_usuario: usuario.nombre_usuario,
    email: usuario.email,
    rol: persona.rol,
    nombre: persona.nombre,
    apellido: persona.apellido,
    url_foto: persona.url_foto || null,
    id_gimnasio: perfil?.id_gimnasio || null,
    nombre_gimnasio: perfil?.gimnasio?.nombre || null,
  }
}

export const supabaseAuthAdapter = {
  mode: 'supabase',

  async login({ identifier, password }) {
    const supabase = getSupabaseClient()
    const email = await resolveEmail(supabase, identifier)
    if (!email) {
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.' } }
    }
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError || !authData.user) {
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos.' } }
    }
    const user = await fetchPersonaByAuthUid(supabase, authData.user.id)
    if (!user) {
      await supabase.auth.signOut()
      return { ok: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Tu cuenta se encuentra deshabilitada. Comunicate con tu profesor.' } }
    }
    return {
      ok: true,
      session: {
        token: authData.session.access_token,
        expiresAt: new Date(authData.session.expires_at * 1000).toISOString(),
        user,
      },
      user,
    }
  },

  async logout() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    return { ok: true }
  },

  async getCurrentSession() {
    const supabase = getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null
    const user = await fetchPersonaByAuthUid(supabase, session.user.id)
    if (!user) return null
    return {
      session: {
        token: session.access_token,
        expiresAt: new Date(session.expires_at * 1000).toISOString(),
        user,
      },
      user,
    }
  },

  onAuthStateChange(callback) {
    const supabase = getSupabaseClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          callback('SIGN_OUT', null)
          return
        }
        const user = await fetchPersonaByAuthUid(supabase, session.user.id)
        callback('SIGN_IN', { token: session.access_token, user })
      }
    )
    return { unsubscribe: () => subscription.unsubscribe() }
  },
}
