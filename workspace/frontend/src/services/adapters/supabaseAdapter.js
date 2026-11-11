// Anchored to REQ-FND-004, REQ-FND-008, REQ-FND-011, REQ-FND-012, REQ-GYM-001, REQ-EJE-001
import { getSupabaseClient } from '../supabaseClient'
import { validateTrainingBatchPayload } from '../validators/trainingBatchValidator'
import { validateGimnasioPayload } from '../validators/gimnasiosValidator'
import { validateEjercicioPayload } from '../validators/ejerciciosValidator'
import { validateAlumnoPayload } from '../validators/alumnosValidator'
import { validateRutinaPayload } from '../validators/rutinasValidator'
import {
  saveGimnasioSupabase,
  deleteGimnasioSupabase,
  saveEjercicioSupabase,
  deleteEjercicioSupabase,
  saveEquipamientoSupabase,
  createAlumnoSupabase,
  updateAlumnoSupabase,
  setAlumnoEstadoSupabase,
  saveRutinaCompletaSupabase,
  deleteRutinaSupabase,
} from './supabaseAdapterMutations'
import { fetchHistorialRelacional } from './supabaseHistorialQueries'

async function fetchAlumnosRelacional(supabase, filterPersonaId = null) {
  let query = supabase
    .from('perfil_alumno')
    .select(
      '*, persona:personas!perfil_alumno_id_persona_fkey(*, usuario:usuarios(*)), gimnasio:gimnasios(*)'
    )
    .order('id_persona', { ascending: true })

  if (filterPersonaId) {
    query = query.eq('id_persona', Number(filterPersonaId))
  }

  const { data, error } = await query
  if (error) throw error

  const mapped = (data || []).map((row) => ({
    ...row,
    id_persona: row.id_persona,
    id_usuario: row.persona.usuario.id,
    nombre: row.persona.nombre,
    apellido: row.persona.apellido,
    nombre_completo: `${row.persona.nombre} ${row.persona.apellido}`.trim(),
    nombre_usuario: row.persona.usuario.nombre_usuario,
    email: row.persona.usuario.email,
    telefono: row.persona.telefono,
    fecha_nacimiento: row.persona.fecha_nacimiento,
    url_foto: row.persona.url_foto,
    estado: row.persona.estado,
    persona: row.persona,
    usuario: row.persona.usuario,
    gimnasio: row.gimnasio,
  }))

  return filterPersonaId ? mapped[0] || null : mapped
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
    .select('*, ejercicios:rutina_ejercicios(*, ejercicio:ejercicios(*, equipamiento_requerido:equipamiento(*)))')
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

  async getAlumnoById(idPersona) {
    return fetchAlumnosRelacional(getSupabaseClient(), idPersona)
  },

  async crearAlumno(payload) {
    const validation = validateAlumnoPayload(payload, false)
    if (!validation.ok) return validation
    try {
      const data = await createAlumnoSupabase(getSupabaseClient(), payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: err.code || 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async actualizarAlumno(idPersona, payload) {
    const validation = validateAlumnoPayload(payload, true)
    if (!validation.ok) return validation
    try {
      const data = await updateAlumnoSupabase(getSupabaseClient(), idPersona, payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: err.code || 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async cambiarEstadoAlumno(idPersona, nuevoEstado) {
    try {
      const success = await setAlumnoEstadoSupabase(getSupabaseClient(), idPersona, nuevoEstado)
      return { ok: success, id_persona: Number(idPersona), estado: Boolean(nuevoEstado) }
    } catch (err) {
      return { ok: false, error: { code: err.code || 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async getMiPerfilAlumno(personaId = null) {
    const supabase = getSupabaseClient()
    let alumno
    if (personaId) {
      alumno = await fetchAlumnosRelacional(supabase, personaId)
    } else {
      const { data: persona } = await supabase
        .from('personas')
        .select('id')
        .eq('rol', 'alumno')
        .limit(1)
        .maybeSingle()
      if (!persona) return null
      alumno = await fetchAlumnosRelacional(supabase, persona.id)
    }
    if (!alumno) return null
    const { data: profesor } = await supabase
      .from('personas')
      .select('*, usuario:usuarios(*)')
      .eq('rol', 'profesor')
      .limit(1)
      .maybeSingle()
    return {
      ...alumno,
      profesor: profesor
        ? {
            id: profesor.id,
            nombre: profesor.nombre,
            apellido: profesor.apellido,
            nombre_completo: `${profesor.nombre} ${profesor.apellido}`.trim(),
            email: profesor.usuario.email,
            telefono: profesor.telefono,
          }
        : null,
    }
  },

  async getGimnasios() {
    return fetchGimnasiosRelacional(getSupabaseClient())
  },

  async getEquipamientoMaestro() {
    const { data, error } = await getSupabaseClient()
      .from('equipamiento')
      .select('*')
      .order('id', { ascending: true })
    if (error) throw error
    return data || []
  },

  async guardarEquipamiento(payload) {
    if (!payload?.nombre?.trim()) {
      return { ok: false, error: { message: 'El nombre del equipamiento es obligatorio' } }
    }
    try {
      const data = await saveEquipamientoSupabase(getSupabaseClient(), payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async guardarGimnasio(payload) {
    const validation = validateGimnasioPayload(payload)
    if (!validation.ok) return validation
    try {
      const data = await saveGimnasioSupabase(getSupabaseClient(), payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async eliminarGimnasio(id) {
    try {
      const success = await deleteGimnasioSupabase(getSupabaseClient(), id)
      return { ok: success }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async getEjercicios() {
    const { data, error } = await getSupabaseClient()
      .from('ejercicios')
      .select('*, equipamiento_requerido:equipamiento(*)')
      .order('id', { ascending: true })
    if (error) throw error
    return data || []
  },

  async guardarEjercicio(payload) {
    const validation = validateEjercicioPayload(payload)
    if (!validation.ok) return validation
    try {
      const data = await saveEjercicioSupabase(getSupabaseClient(), payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async eliminarEjercicio(id) {
    try {
      const success = await deleteEjercicioSupabase(getSupabaseClient(), id)
      return { ok: success }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async getRutinasByAlumno(idAlumno) {
    return fetchRutinasRelacional(getSupabaseClient(), idAlumno)
  },

  async getHistorialByAlumno(idAlumno) {
    return fetchHistorialRelacional(getSupabaseClient(), idAlumno)
  },

  async guardarRutinaCompleta(payload) {
    const validation = validateRutinaPayload(payload)
    if (!validation.ok) return validation
    try {
      const data = await saveRutinaCompletaSupabase(getSupabaseClient(), payload)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
  },

  async eliminarRutina(idRutina) {
    try {
      const success = await deleteRutinaSupabase(getSupabaseClient(), idRutina)
      return { ok: success }
    } catch (err) {
      return { ok: false, error: { code: 'SUPABASE_ERROR', message: err.message } }
    }
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
