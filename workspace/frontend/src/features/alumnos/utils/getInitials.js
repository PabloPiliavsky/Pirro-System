// Anchored to REQ-ALU-007

export function getInitials(nombre, apellido) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}
