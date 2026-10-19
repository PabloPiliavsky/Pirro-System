// Anchored to REQ-EJE-003, REQ-EJE-004

export function validateEjercicioPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      error: { code: 'INVALID_EJERCICIO_PAYLOAD', message: 'Los datos del ejercicio son inválidos.' },
    }
  }

  const nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : ''
  if (!nombre) {
    return {
      ok: false,
      error: { code: 'INVALID_EJERCICIO_PAYLOAD', message: 'El nombre del ejercicio es obligatorio.' },
    }
  }

  const grupo = typeof payload.grupo_muscular === 'string' ? payload.grupo_muscular.trim() : ''
  if (!grupo) {
    return {
      ok: false,
      error: { code: 'INVALID_EJERCICIO_PAYLOAD', message: 'El grupo muscular es obligatorio.' },
    }
  }

  if (payload.requiere_equipamiento && !payload.id_equipamiento_requerido) {
    return {
      ok: false,
      error: {
        code: 'INVALID_EJERCICIO_PAYLOAD',
        message: 'Debés seleccionar el equipamiento o máquina requerida.',
      },
    }
  }

  return { ok: true }
}
