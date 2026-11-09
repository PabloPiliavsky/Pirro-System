// Anchored to REQ-RUT-004
import { validateEjerciciosList } from './validateEjerciciosList'

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

export default validateRutinaPayload
