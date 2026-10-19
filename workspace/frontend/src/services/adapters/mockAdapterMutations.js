// Anchored to REQ-GYM-002, REQ-GYM-004, REQ-EJE-002, REQ-EJE-005

export function saveGimnasioMock(db, payload) {
  let gimnasio
  if (payload.id) {
    gimnasio = db.gimnasios.find((g) => g.id === Number(payload.id))
    if (!gimnasio) throw new Error(`Gimnasio ${payload.id} no encontrado`)
    gimnasio.nombre = payload.nombre.trim()
    gimnasio.direccion = payload.direccion || null
    gimnasio.horario_apertura = payload.horario_apertura || null
    gimnasio.horario_cierre = payload.horario_cierre || null
    if (typeof payload.estado === 'boolean') gimnasio.estado = payload.estado
  } else {
    const nextId = db.gimnasios.reduce((max, g) => Math.max(max, g.id), 0) + 1
    gimnasio = {
      id: nextId,
      id_profesor: 1,
      nombre: payload.nombre.trim(),
      direccion: payload.direccion || null,
      horario_apertura: payload.horario_apertura || null,
      horario_cierre: payload.horario_cierre || null,
      estado: true,
    }
    db.gimnasios.push(gimnasio)
  }

  if (Array.isArray(payload.equipamientoIds)) {
    // Eliminar equipamientos previos no incluidos
    db.gimnasio_equipamiento = db.gimnasio_equipamiento.filter(
      (ge) => ge.id_gimnasio !== gimnasio.id
    )
    let nextGeId = db.gimnasio_equipamiento.reduce((max, ge) => Math.max(max, ge.id), 0) + 1
    payload.equipamientoIds.forEach((eqId) => {
      db.gimnasio_equipamiento.push({
        id: nextGeId++,
        id_gimnasio: gimnasio.id,
        id_equipamiento: Number(eqId),
        cantidad: 1,
        observaciones: null,
        estado: true,
      })
    })
  }

  return gimnasio
}

export function deleteGimnasioMock(db, id) {
  const g = db.gimnasios.find((item) => item.id === Number(id))
  if (g) {
    g.estado = false
    return true
  }
  return false
}

export function saveEjercicioMock(db, payload) {
  let ejercicio
  if (payload.id) {
    ejercicio = db.ejercicios.find((e) => e.id === Number(payload.id))
    if (!ejercicio) throw new Error(`Ejercicio ${payload.id} no encontrado`)
    ejercicio.nombre = payload.nombre.trim()
    ejercicio.grupo_muscular = payload.grupo_muscular.trim()
    ejercicio.requiere_equipamiento = Boolean(payload.requiere_equipamiento)
    ejercicio.id_equipamiento_requerido = payload.requiere_equipamiento
      ? Number(payload.id_equipamiento_requerido)
      : null
    ejercicio.indicaciones = payload.indicaciones || null
    ejercicio.url_video = payload.url_video || null
    if (typeof payload.estado === 'boolean') ejercicio.estado = payload.estado
  } else {
    const nextId = db.ejercicios.reduce((max, e) => Math.max(max, e.id), 0) + 1
    ejercicio = {
      id: nextId,
      id_profesor: 1,
      nombre: payload.nombre.trim(),
      grupo_muscular: payload.grupo_muscular.trim(),
      requiere_equipamiento: Boolean(payload.requiere_equipamiento),
      id_equipamiento_requerido: payload.requiere_equipamiento
        ? Number(payload.id_equipamiento_requerido)
        : null,
      indicaciones: payload.indicaciones || null,
      url_video: payload.url_video || null,
      estado: true,
    }
    db.ejercicios.push(ejercicio)
  }
  return ejercicio
}

export function deleteEjercicioMock(db, id) {
  const e = db.ejercicios.find((item) => item.id === Number(id))
  if (e) {
    e.estado = false
    return true
  }
  return false
}

export function saveEquipamientoMock(db, payload) {
  const nextId = db.equipamiento.reduce((max, eq) => Math.max(max, eq.id), 0) + 1
  const equipamiento = {
    id: nextId,
    nombre: payload.nombre.trim(),
    categoria: payload.categoria || 'maquina',
    descripcion: payload.descripcion || null,
  }
  db.equipamiento.push(equipamiento)
  return equipamiento
}
