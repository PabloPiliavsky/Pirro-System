// Anchored to REQ-TRN-009, REQ-TRN-011

export async function fetchHistorialRelacional(client, idAlumno) {
  const { data, error } = await client
    .from('registros_rutina')
    .select(`
      id,
      client_submission_id,
      id_alumno,
      id_rutina,
      fecha_realizacion,
      created_at,
      rutina:rutinas (
        id,
        nombre_rutina,
        numero_dia
      ),
      series:detalle_series (
        id,
        id_registro_rutina,
        id_ejercicio,
        numero_serie,
        repeticiones_objetivo,
        repeticiones_realizadas,
        peso_utilizado,
        comentario_alumno,
        ejercicio:ejercicios (
          id,
          nombre,
          grupo_muscular
        )
      )
    `)
    .eq('id_alumno', idAlumno)
    .order('fecha_realizacion', { ascending: false })
    .order('id', { ascending: false })

  if (error) throw error
  return data || []
}
