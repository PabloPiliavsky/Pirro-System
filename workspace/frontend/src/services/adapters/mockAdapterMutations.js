// TODO: [MOCK-CLEANUP] Eliminar este archivo completamente cuando la fase de desarrollo/test mock finalice y se utilice exclusivamente Supabase.
// Anchored to REQ-GYM-002, REQ-GYM-004, REQ-EJE-002, REQ-EJE-005, REQ-ALU-002, REQ-ALU-003, REQ-ALU-006

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

export function createAlumnoMock(db, payload) {
  const emailLower = payload.email.trim().toLowerCase()
  const usuarioLower = payload.nombre_usuario.trim().toLowerCase()

  if (db.usuarios.some((u) => u.email.toLowerCase() === emailLower)) {
    const error = new Error('El correo electrónico ya se encuentra registrado.')
    error.code = 'DUPLICATE_USER_CREDENTIALS'
    throw error
  }

  if (db.usuarios.some((u) => u.nombre_usuario.toLowerCase() === usuarioLower)) {
    const error = new Error('El nombre de usuario ya se encuentra registrado.')
    error.code = 'DUPLICATE_USER_CREDENTIALS'
    throw error
  }

  const nextUsuarioId = db.usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1
  const nuevoUsuario = {
    id: nextUsuarioId,
    auth_user_id: `mock-user-${nextUsuarioId}`,
    nombre_usuario: payload.nombre_usuario.trim(),
    email: emailLower,
    password_hash: payload.password || 'Pirro123!',
    estado: true,
    ultimo_acceso: null,
  }
  db.usuarios.push(nuevoUsuario)

  const nextPersonaId = db.personas.reduce((max, p) => Math.max(max, p.id), 0) + 1
  const nuevaPersona = {
    id: nextPersonaId,
    id_usuario: nextUsuarioId,
    rol: 'alumno',
    nombre: payload.nombre.trim(),
    apellido: payload.apellido.trim(),
    fecha_nacimiento: payload.fecha_nacimiento || null,
    telefono: payload.telefono?.trim() || null,
    url_foto: payload.url_foto || null,
    estado: true,
  }
  db.personas.push(nuevaPersona)

  const nuevoPerfil = {
    id_persona: nextPersonaId,
    id_profesor: 1,
    id_gimnasio: payload.id_gimnasio ? Number(payload.id_gimnasio) : null,
    altura_cm: payload.altura_cm ? Number(payload.altura_cm) : null,
    peso_kg: payload.peso_kg ? Number(payload.peso_kg) : null,
    salud_enfermedades: payload.salud_enfermedades?.trim() || null,
    fecha_ingreso: payload.fecha_ingreso || new Date().toISOString().slice(0, 10),
    cantidad_dias_rutina: payload.cantidad_dias_rutina ? Number(payload.cantidad_dias_rutina) : 3,
    mostrar_imc: Boolean(payload.mostrar_imc),
    comentario: payload.comentario?.trim() || null,
  }
  db.perfil_alumno.push(nuevoPerfil)

  return { id_persona: nextPersonaId, id_usuario: nextUsuarioId }
}

export function updateAlumnoMock(db, idPersona, payload) {
  const persona = db.personas.find((p) => p.id === Number(idPersona))
  if (!persona) throw new Error(`Alumno ${idPersona} no encontrado`)
  const perfil = db.perfil_alumno.find((pa) => pa.id_persona === Number(idPersona))
  if (!perfil) throw new Error(`Perfil del alumno ${idPersona} no encontrado`)
  const usuario = db.usuarios.find((u) => u.id === persona.id_usuario)

  if (payload.nombre) persona.nombre = payload.nombre.trim()
  if (payload.apellido) persona.apellido = payload.apellido.trim()
  if (payload.telefono !== undefined) persona.telefono = payload.telefono?.trim() || null
  if (payload.fecha_nacimiento !== undefined) persona.fecha_nacimiento = payload.fecha_nacimiento || null
  if (payload.url_foto !== undefined) persona.url_foto = payload.url_foto || null

  if (usuario && payload.email) {
    const emailLower = payload.email.trim().toLowerCase()
    if (db.usuarios.some((u) => u.id !== usuario.id && u.email.toLowerCase() === emailLower)) {
      const error = new Error('El correo electrónico ya se encuentra registrado.')
      error.code = 'DUPLICATE_USER_CREDENTIALS'
      throw error
    }
    usuario.email = emailLower
  }

  if (payload.id_gimnasio !== undefined) {
    perfil.id_gimnasio = payload.id_gimnasio ? Number(payload.id_gimnasio) : null
  }
  if (payload.altura_cm !== undefined) {
    perfil.altura_cm = payload.altura_cm ? Number(payload.altura_cm) : null
  }
  if (payload.peso_kg !== undefined) {
    perfil.peso_kg = payload.peso_kg ? Number(payload.peso_kg) : null
  }
  if (payload.salud_enfermedades !== undefined) {
    perfil.salud_enfermedades = payload.salud_enfermedades?.trim() || null
  }
  if (payload.fecha_ingreso) perfil.fecha_ingreso = payload.fecha_ingreso
  if (payload.cantidad_dias_rutina !== undefined) {
    perfil.cantidad_dias_rutina = Number(payload.cantidad_dias_rutina)
  }
  if (payload.mostrar_imc !== undefined) {
    perfil.mostrar_imc = Boolean(payload.mostrar_imc)
  }
  if (payload.comentario !== undefined) {
    perfil.comentario = payload.comentario?.trim() || null
  }

  return { id_persona: Number(idPersona) }
}

export function setAlumnoEstadoMock(db, idPersona, nuevoEstado) {
  const persona = db.personas.find((p) => p.id === Number(idPersona))
  if (!persona) return false
  persona.estado = Boolean(nuevoEstado)
  const usuario = db.usuarios.find((u) => u.id === persona.id_usuario)
  if (usuario) usuario.estado = Boolean(nuevoEstado)
  return true
}
