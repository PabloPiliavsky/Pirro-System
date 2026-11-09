// TODO: [MOCK-CLEANUP] Eliminar este archivo completamente cuando la fase de desarrollo/test mock finalice y se utilice exclusivamente Supabase.
// Anchored to REQ-FND-004, REQ-FND-005, REQ-FND-006, REQ-ALU-001, REQ-ALU-008, REQ-ALU-009

export function buildAlumnosView(db) {
  return db.perfil_alumno.map((perfil) => {
    const persona = db.personas.find((p) => p.id === perfil.id_persona)
    const usuario = db.usuarios.find((u) => u.id === persona?.id_usuario)
    const gimnasio = db.gimnasios.find((g) => g.id === perfil.id_gimnasio) || null
    return {
      ...perfil,
      id_persona: perfil.id_persona,
      id_usuario: usuario?.id,
      nombre: persona?.nombre || '',
      apellido: persona?.apellido || '',
      nombre_completo: `${persona?.nombre || ''} ${persona?.apellido || ''}`.trim(),
      nombre_usuario: usuario?.nombre_usuario || '',
      email: usuario?.email || '',
      telefono: persona?.telefono || null,
      fecha_nacimiento: persona?.fecha_nacimiento || null,
      url_foto: persona?.url_foto || null,
      estado: persona?.estado ?? true,
      mostrar_imc: Boolean(perfil.mostrar_imc),
      persona,
      usuario,
      gimnasio,
    }
  })
}

export function buildAlumnoByIdView(db, idPersona) {
  const alumnos = buildAlumnosView(db)
  return alumnos.find((a) => a.id_persona === Number(idPersona)) || null
}

export function buildMiPerfilAlumnoView(db, personaId = 2) {
  const alumno = buildAlumnoByIdView(db, personaId)
  if (!alumno) return null
  const profesorPersona = db.personas.find((p) => p.id === alumno.id_profesor)
  const profesorUsuario = db.usuarios.find((u) => u.id === profesorPersona?.id_usuario)
  return {
    ...alumno,
    profesor: profesorPersona
      ? {
          id: profesorPersona.id,
          nombre: profesorPersona.nombre,
          apellido: profesorPersona.apellido,
          nombre_completo: `${profesorPersona.nombre} ${profesorPersona.apellido}`.trim(),
          email: profesorUsuario?.email || 'leandro@pirrosystem.com',
          telefono: profesorPersona.telefono || '+54 9 11 5555-0101',
        }
      : null,
  }
}

export function buildGimnasiosView(db) {
  return db.gimnasios.map((gimnasio) => {
    const equipamientoDisponible = db.gimnasio_equipamiento
      .filter((ge) => ge.id_gimnasio === gimnasio.id && ge.estado)
      .map((ge) => ({
        ...ge,
        equipamiento: db.equipamiento.find((eq) => eq.id === ge.id_equipamiento) || null,
      }))
    return { ...gimnasio, equipamiento_disponible: equipamientoDisponible }
  })
}

export function buildRutinasByAlumno(db, idAlumno) {
  return db.rutinas
    .filter((r) => r.id_alumno === Number(idAlumno) && r.activa)
    .map((rutina) => {
      const ejercicios = db.rutina_ejercicios
        .filter((re) => re.id_rutina === rutina.id)
        .sort((a, b) => a.orden - b.orden)
        .map((re) => ({
          ...re,
          ejercicio: db.ejercicios.find((ej) => ej.id === re.id_ejercicio) || null,
        }))
      return { ...rutina, ejercicios }
    })
}

export function buildSystemSummaryView(db) {
  const profesorPersona = db.personas.find((p) => p.rol === 'profesor') || null
  const profesorUsuario = db.usuarios.find((u) => u.id === profesorPersona?.id_usuario) || null

  return {
    mode: 'mock',
    profesor: profesorPersona ? { ...profesorPersona, usuario: profesorUsuario } : null,
    counts: {
      usuarios: db.usuarios.length,
      personas: db.personas.length,
      alumnos: db.perfil_alumno.length,
      gimnasios: db.gimnasios.length,
      ejercicios: db.ejercicios.length,
      rutinas: db.rutinas.length,
      registros_rutina: db.registros_rutina.length,
      detalle_series: db.detalle_series.length,
    },
    alumnos: buildAlumnosView(db),
    gimnasios: buildGimnasiosView(db),
    ejercicios: db.ejercicios,
    rutinas: buildRutinasByAlumno(db, 2),
    registrosRecientes: db.registros_rutina.map((reg) => ({
      ...reg,
      series: db.detalle_series.filter((ds) => ds.id_registro_rutina === reg.id),
    })),
  }
}

export function buildEjerciciosView(db) {
  return db.ejercicios.map((ej) => ({
    ...ej,
    equipamiento_requerido: ej.id_equipamiento_requerido
      ? db.equipamiento.find((eq) => eq.id === ej.id_equipamiento_requerido) || null
      : null,
  }))
}
