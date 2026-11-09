// Anchored to REQ-ALU-007

export function getInitials(nombre, apellido) {
  const n = (nombre || '').trim().charAt(0).toUpperCase()
  const a = (apellido || '').trim().charAt(0).toUpperCase()
  return `${n}${a}` || 'AL'
}
