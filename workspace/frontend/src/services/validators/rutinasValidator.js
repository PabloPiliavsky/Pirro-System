// Anchored to REQ-RUT-004

function validateEjerciciosList(ejercicios) {
  if (!Array.isArray(ejercicios)) return 'La lista de ejercicios debe ser un arreglo.'

  for (let i = 0; i < ejercicios.length; i++) {
    const ej = ejercicios[i]
    if (!ej || !ej.id_ejercicio) {
      return `El ejercicio en la posición ${i + 1} no es válido.`
    }
    const series = Number(ej.series_objetivo)
    if (isNaN(series) || series < 1) {
      return `Las series del ejercicio ${i + 1} deben ser un número mayor o igual a 1.`
    }
    const reps = typeof ej.repeticiones_objetivo === 'string' ? ej.repeticiones_objetivo.trim() : ''
    if (!reps) {
      return `Las repeticiones del ejercicio ${i + 1} son obligatorias (ej: '10-12').`
    }
  }
  return null
}

export function validateRutinaPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      error: { code: 'INVALID_RUTINA_PAYLOAD', message: 'Datos de rutina inválidos.' },
    }
  }

  if (!payload.id_alumno) {
    return {
      ok: false,
      error: { code: 'INVALID_RUTINA_PAYLOAD', message: 'Debés seleccionar un alumno.' },
    }
  }

  const dia = Number(payload.numero_dia)
  if (isNaN(dia) || dia < 1 || dia > 7) {
    return {
      ok: false,
      error: { code: 'INVALID_RUTINA_PAYLOAD', message: 'El número de día debe estar entre 1 y 7.' },
    }
  }

  const nombre = typeof payload.nombre_rutina === 'string' ? payload.nombre_rutina.trim() : ''
  if (!nombre) {
    return {
      ok: false,
      error: { code: 'INVALID_RUTINA_PAYLOAD', message: 'El nombre de la rutina es obligatorio.' },
    }
  }

  const errorEjercicios = validateEjerciciosList(payload.ejercicios || [])
  if (errorEjercicios) {
    return {
      ok: false,
      error: { code: 'INVALID_RUTINA_PAYLOAD', message: errorEjercicios },
    }
  }

  return { ok: true }
}
