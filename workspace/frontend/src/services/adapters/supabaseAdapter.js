// Anchored to REQ-FND-004, REQ-FND-008, REQ-FND-011, REQ-FND-012
import { getSupabaseClient } from '../supabaseClient'
import { validateTrainingBatchPayload } from '../validators/trainingBatchValidator'

async function fetchAlumnosRelacional(supabase) {
  const { data, error } = await supabase
    .from('perfil_alumno')
    .select(
      '*, persona:personas!perfil_alumno_id_persona_fkey(*, usuario:usuarios(*)), gimnasio:gimnasios(*)'
    )
    .order('id_persona', { ascending: true })

  if (error) throw error
  return (data || []).map((row) => ({
    ...row,
    usuario: row.persona?.usuario || null,
  }))
}

async function fetchGimnasiosRelacional(supabase) {
  const { data, error } = await supabase
    .from('gimnasios')
    .select('*, equipamiento_disponible:gimnasio_equipamiento(*, equipamiento(*))')
    .order('id', { ascending: true })

  if (error) throw error
  return data || []
}

async function fetchRutinasRelacional(supabase, idAlumno) {
  const { data, error } = await supabase
    .from('rutinas')
    .select('*, ejercicios:rutina_ejercicios(*, ejercicio:ejercicios(*))')
    .eq('id_alumno', Number(idAlumno))
    .eq('activa', true)
    .order('numero_dia', { ascending: true })

  if (error) throw error
  return data || []
}

export const supabaseAdapter = {
  mode: 'supabase',

  async getSystemStatusSummary() {
    const supabase = getSupabaseClient()
    const [alumnos, gimnasios, ejerciciosRes, rutinas, registrosRes, profRes] = await Promise.all([
      fetchAlumnosRelacional(supabase),
      fetchGimnasiosRelacional(supabase),
      supabase.from('ejercicios').select('*').order('id', { ascending: true }),
      fetchRutinasRelacional(supabase, 2),
      supabase
        .from('registros_rutina')
        .select('*, series:detalle_series(*)')
        .order('id', { ascending: true }),
      supabase
        .from('personas')
        .select('*, usuario:usuarios(*)')
        .eq('rol', 'profesor')
        .limit(1)
        .maybeSingle(),
    ])

    const ejercicios = ejerciciosRes.data || []
    const registrosRecientes = registrosRes.data || []
    const totalSeries = registrosRecientes.reduce((acc, r) => acc + (r.series?.length || 0), 0)

    return {
      mode: 'supabase',
      profesor: profRes.data || null,
      counts: {
        usuarios: alumnos.length + (profRes.data ? 1 : 0),
        personas: alumnos.length + (profRes.data ? 1 : 0),
        alumnos: alumnos.length,
        gimnasios: gimnasios.length,
        ejercicios: ejercicios.length,
        rutinas: rutinas.length,
        registros_rutina: registrosRecientes.length,
        detalle_series: totalSeries,
      },
      alumnos,
      gimnasios,
      ejercicios,
      rutinas,
      registrosRecientes,
    }
  },

  async getAlumnos() {
    return fetchAlumnosRelacional(getSupabaseClient())
  },

  async getGimnasios() {
    return fetchGimnasiosRelacional(getSupabaseClient())
  },

  async getEjercicios() {
    const { data, error } = await getSupabaseClient()
      .from('ejercicios')
      .select('*')
      .order('id', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getRutinasByAlumno(idAlumno) {
    return fetchRutinasRelacional(getSupabaseClient(), idAlumno)
  },

  async guardarEntrenamientoBatch(payload) {
    const validation = validateTrainingBatchPayload(payload)
    if (!validation.ok) return validation

    const { data, error } = await getSupabaseClient().rpc('guardar_entrenamiento_batch', {
      payload,
    })

    if (error) {
      return {
        ok: false,
        error: { code: error.code || 'SUPABASE_RPC_ERROR', message: error.message },
      }
    }
    return data
  },

  async resetMockDatabase() {
    return {
      ok: false,
      restored: false,
      message: 'En modo SUPABASE usa npx supabase db reset para restaurar seed.sql.',
    }
  },
}
