// Anchored to REQ-ALU-007

export function formatearWhatsAppLink(telefono, alumnoNombre = '') {
  if (!telefono || typeof telefono !== 'string') return null
  const digitos = telefono.replace(/\D/g, '')
  if (!digitos || digitos.length < 8) return null

  let cleanNumber = digitos
  if (!cleanNumber.startsWith('54') && cleanNumber.length === 10) {
    cleanNumber = `549${cleanNumber}`
  }

  const saludo = alumnoNombre ? `¡Hola ${alumnoNombre}!` : '¡Hola!'
  const mensaje = `${saludo} Te contacto de Pirro-System para coordinar tu entrenamiento.`
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(mensaje)}`
}
