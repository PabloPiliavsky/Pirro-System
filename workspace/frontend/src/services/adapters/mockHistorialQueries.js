// TODO: [MOCK-CLEANUP] Eliminar cuando se retire mockAdapter y se use exclusivamente Supabase.
// Anchored to REQ-TRN-009, REQ-TRN-011

export function buildHistorialByAlumno(db, idAlumno) {
  return db.registros_rutina
    .filter((r) => r.id_alumno === Number(idAlumno))
    .sort((a, b) => new Date(b.fecha_realizacion) - new Date(a.fecha_realizacion) || b.id - a.id)
    .map((reg) => {
      const rutina = db.rutinas.find((rt) => rt.id === reg.id_rutina)
      const series = db.detalle_series
        .filter((ds) => ds.id_registro_rutina === reg.id)
        .sort((a, b) => a.numero_serie - b.numero_serie)
        .map((ds) => {
          const ej = db.ejercicios.find((e) => e.id === ds.id_ejercicio)
          return {
            ...ds,
            ejercicio: ej ? { id: ej.id, nombre: ej.nombre, grupo_muscular: ej.grupo_muscular } : null,
          }
        })
      return {
        ...reg,
        rutina: rutina ? { id: rutina.id, nombre_rutina: rutina.nombre_rutina, numero_dia: rutina.numero_dia } : null,
        series,
      }
    })
}
