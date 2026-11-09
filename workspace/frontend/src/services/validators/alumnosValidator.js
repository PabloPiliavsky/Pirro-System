// Anchored to REQ-ALU-004

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateBiometria(altura, peso) {
  if (altura !== null && altura !== undefined && altura !== '') {
    const altNum = Number(altura)
    if (isNaN(altNum) || altNum <= 0 || altNum > 280) {
      return 'La altura debe ser un valor numérico válido en centímetros (ej: 175).'
    }
  }
  if (peso !== null && peso !== undefined && peso !== '') {
    const pesoNum = Number(peso)
    if (isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 400) {
      return 'El peso debe ser un valor numérico válido en kilogramos (ej: 72.5).'
    }
  }
  return null
}

export function validateAlumnoPayload(payload, isEdit = false) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'Datos de alumno inválidos.' } }
  }

  const nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : ''
  const apellido = typeof payload.apellido === 'string' ? payload.apellido.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const usuario = typeof payload.nombre_usuario === 'string' ? payload.nombre_usuario.trim() : ''

  if (!isEdit && (!nombre || !apellido)) {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'Nombre y apellido son obligatorios.' } }
  }

  if (isEdit) {
    if (payload.nombre !== undefined && !nombre) {
      return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'El nombre no puede estar vacío.' } }
    }
    if (payload.apellido !== undefined && !apellido) {
      return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'El apellido no puede estar vacío.' } }
    }
  }

  if (!isEdit && (!usuario || !email)) {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'Nombre de usuario y email son requeridos.' } }
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'El formato de correo electrónico no es válido.' } }
  }

  const dias = Number(payload.cantidad_dias_rutina)
  if (payload.cantidad_dias_rutina !== undefined && (isNaN(dias) || dias < 1 || dias > 7)) {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: 'La cantidad de días de rutina debe estar entre 1 y 7.' } }
  }

  const bioError = validateBiometria(payload.altura_cm, payload.peso_kg)
  if (bioError) {
    return { ok: false, error: { code: 'INVALID_ALUMNO_DATA', message: bioError } }
  }

  return { ok: true }
}
