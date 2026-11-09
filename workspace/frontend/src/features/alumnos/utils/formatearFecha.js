// Anchored to REQ-ALU-008

export function formatearFecha(fechaStr) {
  if (!fechaStr) return '-'
  try {
    const parts = String(fechaStr).split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return new Date(fechaStr).toLocaleDateString('es-AR')
  } catch {
    return String(fechaStr)
  }
}
