// Anchored to REQ-GYM-003

export function validateGimnasioPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      error: { code: 'INVALID_GIMNASIO_PAYLOAD', message: 'Los datos del gimnasio son inválidos.' },
    }
  }

  const nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : ''
  if (!nombre) {
    return {
      ok: false,
      error: { code: 'INVALID_GIMNASIO_PAYLOAD', message: 'El nombre de la sede es obligatorio.' },
    }
  }

  return { ok: true }
}
