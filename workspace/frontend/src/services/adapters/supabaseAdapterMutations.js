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
