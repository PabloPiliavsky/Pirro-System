// Anchored to REQ-ALU-007

export function filterAlumnoItem(alumno, search, gymId, status) {
  if (status === 'ACTIVE' && !alumno.estado) return false
  if (status === 'INACTIVE' && alumno.estado) return false

  if (gymId !== 'ALL') {
    if (gymId === 'NONE' && alumno.id_gimnasio !== null) return false
    if (gymId !== 'NONE' && String(alumno.id_gimnasio) !== String(gymId)) return false
  }

  if (!search) return true
  const term = search.toLowerCase()
  const nombre = alumno.nombre_completo.toLowerCase()
  const usuario = alumno.nombre_usuario.toLowerCase()
  const email = alumno.email.toLowerCase()

  return nombre.includes(term) || usuario.includes(term) || email.includes(term)
}
