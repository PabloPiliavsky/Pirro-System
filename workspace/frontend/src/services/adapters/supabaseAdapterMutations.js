// Anchored to REQ-GYM-002, REQ-GYM-004, REQ-EJE-002, REQ-EJE-005

export async function saveGimnasioSupabase(supabase, payload) {
  let gimnasioId = payload.id
  const gymRow = {
    nombre: payload.nombre.trim(),
    direccion: payload.direccion || null,
    horario_apertura: payload.horario_apertura || null,
    horario_cierre: payload.horario_cierre || null,
  }
  if (typeof payload.estado === 'boolean') gymRow.estado = payload.estado

  if (gimnasioId) {
    const { data, error } = await supabase
      .from('gimnasios')
      .update(gymRow)
      .eq('id', Number(gimnasioId))
      .select()
      .single()
    if (error) throw error
  } else {
    gymRow.id_profesor = 1
    gymRow.estado = true
    const { data, error } = await supabase.from('gimnasios').insert(gymRow).select().single()
    if (error) throw error
    gimnasioId = data.id
  }

  if (Array.isArray(payload.equipamientoIds)) {
    await supabase.from('gimnasio_equipamiento').delete().eq('id_gimnasio', gimnasioId)
    if (payload.equipamientoIds.length > 0) {
      const rows = payload.equipamientoIds.map((eqId) => ({
        id_gimnasio: gimnasioId,
        id_equipamiento: Number(eqId),
        cantidad: 1,
        estado: true,
      }))
      const { error: insErr } = await supabase.from('gimnasio_equipamiento').insert(rows)
      if (insErr) throw insErr
    }
  }

  return { id: gimnasioId, ...gymRow }
}

export async function deleteGimnasioSupabase(supabase, id) {
  const { error } = await supabase.from('gimnasios').update({ estado: false }).eq('id', Number(id))
  if (error) throw error
  return true
}

export async function saveEjercicioSupabase(supabase, payload) {
  const ejerRow = {
    nombre: payload.nombre.trim(),
    grupo_muscular: payload.grupo_muscular.trim(),
    requiere_equipamiento: Boolean(payload.requiere_equipamiento),
    id_equipamiento_requerido: payload.requiere_equipamiento
      ? Number(payload.id_equipamiento_requerido)
      : null,
    indicaciones: payload.indicaciones || null,
    url_video: payload.url_video || null,
  }
  if (typeof payload.estado === 'boolean') ejerRow.estado = payload.estado

  let id = payload.id
  if (id) {
    const { error } = await supabase.from('ejercicios').update(ejerRow).eq('id', Number(id))
    if (error) throw error
  } else {
    ejerRow.id_profesor = 1
    ejerRow.estado = true
    const { data, error } = await supabase.from('ejercicios').insert(ejerRow).select().single()
    if (error) throw error
    id = data.id
  }
  return { id, ...ejerRow }
}

export async function deleteEjercicioSupabase(supabase, id) {
  const { error } = await supabase.from('ejercicios').update({ estado: false }).eq('id', Number(id))
  if (error) throw error
  return true
}

export async function saveEquipamientoSupabase(supabase, payload) {
  const eqRow = {
    nombre: payload.nombre.trim(),
    categoria: payload.categoria || 'maquina',
    descripcion: payload.descripcion || null,
  }
  const { data, error } = await supabase.from('equipamiento').insert(eqRow).select().single()
  if (error) throw error
  return data
}

export async function createAlumnoSupabase(supabase, payload) {
  const { data, error } = await supabase.rpc('alta_alumno_profesor', { payload })
  if (error) {
    const err = new Error(error.message)
    err.code = error.code || 'SUPABASE_RPC_ERROR'
    throw err
  }
  if (!data?.ok) {
    const err = new Error(data?.error?.message || 'Error al crear alumno')
    err.code = data?.error?.code || 'SUPABASE_RPC_ERROR'
    throw err
  }
  return data
}

export async function updateAlumnoSupabase(supabase, idPersona, payload) {
  const id = Number(idPersona)
  const { data: persona, error: pErr } = await supabase
    .from('personas')
    .select('id_usuario')
    .eq('id', id)
    .single()
  if (pErr) throw pErr

  const personaUpdates = {}
  if (payload.nombre) personaUpdates.nombre = payload.nombre.trim()
  if (payload.apellido) personaUpdates.apellido = payload.apellido.trim()
  if (payload.telefono !== undefined) personaUpdates.telefono = payload.telefono?.trim() || null
  if (payload.fecha_nacimiento !== undefined) personaUpdates.fecha_nacimiento = payload.fecha_nacimiento || null
  if (payload.url_foto !== undefined) personaUpdates.url_foto = payload.url_foto || null

  if (Object.keys(personaUpdates).length > 0) {
    const { error } = await supabase.from('personas').update(personaUpdates).eq('id', id)
    if (error) throw error
  }

  const perfilUpdates = {}
  if (payload.id_gimnasio !== undefined) {
    perfilUpdates.id_gimnasio = payload.id_gimnasio ? Number(payload.id_gimnasio) : null
  }
  if (payload.altura_cm !== undefined) {
    perfilUpdates.altura_cm = payload.altura_cm ? Number(payload.altura_cm) : null
  }
  if (payload.peso_kg !== undefined) {
    perfilUpdates.peso_kg = payload.peso_kg ? Number(payload.peso_kg) : null
  }
  if (payload.salud_enfermedades !== undefined) {
    perfilUpdates.salud_enfermedades = payload.salud_enfermedades?.trim() || null
  }
  if (payload.fecha_ingreso) perfilUpdates.fecha_ingreso = payload.fecha_ingreso
  if (payload.cantidad_dias_rutina !== undefined) {
    perfilUpdates.cantidad_dias_rutina = Number(payload.cantidad_dias_rutina)
  }
  if (payload.mostrar_imc !== undefined) {
    perfilUpdates.mostrar_imc = Boolean(payload.mostrar_imc)
  }
  if (payload.comentario !== undefined) {
    perfilUpdates.comentario = payload.comentario?.trim() || null
  }

  if (Object.keys(perfilUpdates).length > 0) {
    const { error } = await supabase.from('perfil_alumno').update(perfilUpdates).eq('id_persona', id)
    if (error) throw error
  }

  if (payload.email && persona?.id_usuario) {
    const { error } = await supabase
      .from('usuarios')
      .update({ email: payload.email.trim().toLowerCase() })
      .eq('id', persona.id_usuario)
    if (error) throw error
  }

  return { id_persona: id }
}

export async function setAlumnoEstadoSupabase(supabase, idPersona, nuevoEstado) {
  const id = Number(idPersona)
  const { data: persona, error: pErr } = await supabase
    .from('personas')
    .select('id_usuario')
    .eq('id', id)
    .single()
  if (pErr) throw pErr

  const { error: errP } = await supabase
    .from('personas')
    .update({ estado: Boolean(nuevoEstado) })
    .eq('id', id)
  if (errP) throw errP

  if (persona?.id_usuario) {
    const { error: errU } = await supabase
      .from('usuarios')
      .update({ estado: Boolean(nuevoEstado) })
      .eq('id', persona.id_usuario)
    if (errU) throw errU
  }
  return true
}

export async function saveRutinaCompletaSupabase(supabase, payload) {
  const idAlumno = Number(payload.id_alumno)
  const numeroDia = Number(payload.numero_dia)
  const nombreRutina = payload.nombre_rutina.trim()
  const ejerciciosInput = Array.isArray(payload.ejercicios) ? payload.ejercicios : []

  let rutinaId = null
  const { data: existing } = await supabase
    .from('rutinas')
    .select('id')
    .eq('id_alumno', idAlumno)
    .eq('numero_dia', numeroDia)
    .maybeSingle()

  if (existing) {
    rutinaId = existing.id
    const { error } = await supabase
      .from('rutinas')
      .update({ nombre_rutina: nombreRutina, activa: true })
      .eq('id', rutinaId)
    if (error) throw error
  } else {
    const { data: prof } = await supabase
      .from('personas')
      .select('id')
      .eq('rol', 'profesor')
      .limit(1)
      .single()
    const { data: nueva, error } = await supabase
      .from('rutinas')
      .insert({
        id_alumno: idAlumno,
        id_profesor: prof?.id || 1,
        numero_dia: numeroDia,
        nombre_rutina: nombreRutina,
        activa: true,
      })
      .select()
      .single()
    if (error) throw error
    rutinaId = nueva.id
  }

  const { error: delErr } = await supabase
    .from('rutina_ejercicios')
    .delete()
    .eq('id_rutina', rutinaId)
  if (delErr) throw delErr

  if (ejerciciosInput.length > 0) {
    const rows = ejerciciosInput.map((ej, index) => ({
      id_rutina: rutinaId,
      id_ejercicio: Number(ej.id_ejercicio),
      orden: index + 1,
      series_objetivo: Number(ej.series_objetivo || 3),
      repeticiones_objetivo: String(ej.repeticiones_objetivo || '10-12').trim(),
      notas_profesor: ej.notas_profesor ? String(ej.notas_profesor).trim() : null,
    }))
    const { error: insErr } = await supabase.from('rutina_ejercicios').insert(rows)
    if (insErr) throw insErr
  }

  return { id: rutinaId, id_alumno: idAlumno, numero_dia: numeroDia }
}

export async function deleteRutinaSupabase(supabase, idRutina) {
  const { error } = await supabase
    .from('rutinas')
    .update({ activa: false })
    .eq('id', Number(idRutina))
  if (error) throw error
  return true
}
