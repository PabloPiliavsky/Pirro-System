// Anchored to REQ-FND-004, REQ-FND-005, REQ-FND-006
export function buildAlumnosView(db) {
  return db.perfil_alumno.map((perfil) => {
    const persona = db.personas.find((p) => p.id === perfil.id_persona)
    const usuario = db.usuarios.find((u) => u.id === persona?.id_usuario)
    const gimnasio = db.gimnasios.find((g) => g.id === perfil.id_gimnasio)
    return { ...perfil, persona, usuario, gimnasio }
  })
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

