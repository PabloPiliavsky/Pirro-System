// Anchored to REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-005

export function findUserByIdentifier(usuarios, identifier) {
  if (!identifier) return null
  const cleanId = String(identifier).trim().toLowerCase()
  return usuarios.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.nombre_usuario.toLowerCase() === cleanId
  ) || null
}

export function validatePassword(usuario, password) {
  if (!password) return false
  const p = String(password).trim()
  const baseUsername = usuario.nombre_usuario.split('.')[0]
  return (
    p === 'demo123' ||
    p === 'pirro123' ||
    p === `${baseUsername}123` ||
    p === usuario.password_hash
  )
}

export function buildAuthUser(usuario, persona, db) {
  let idGimnasio = null
  let nombreGimnasio = null

  if (persona.rol === 'alumno') {
    const perfil = db.perfil_alumno.find((p) => p.id_persona === persona.id)
    if (perfil) {
      idGimnasio = perfil.id_gimnasio
      const gym = db.gimnasios.find((g) => g.id === perfil.id_gimnasio)
      nombreGimnasio = gym ? gym.nombre : null
    }
  }

  return {
    id: usuario.id,
    id_usuario: usuario.id,
    id_persona: persona.id,
    nombre_usuario: usuario.nombre_usuario,
    email: usuario.email,
    rol: persona.rol,
    nombre: persona.nombre,
    apellido: persona.apellido,
    url_foto: persona.url_foto || null,
    id_gimnasio: idGimnasio,
    nombre_gimnasio: nombreGimnasio,
  }
}

export function generateMockSession(user) {
  return {
    token: `mock_jwt_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user,
  }
}
