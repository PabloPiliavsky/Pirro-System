// Anchored to REQ-ALU-001, REQ-ALU-002, REQ-ALU-003, REQ-ALU-006, REQ-ALU-010
// TODO: [MOCK-CLEANUP] Retirar consumo mediante getProvider() y conectar directamente a supabaseAdapter cuando se retire mockAdapter.
import { getProvider } from './dataProvider'

export async function fetchAlumnos() {
  return getProvider().getAlumnos()
}

export async function fetchAlumnoById(idPersona) {
  return getProvider().getAlumnoById(idPersona)
}

export async function saveAlumno(payload) {
  return getProvider().crearAlumno(payload)
}

export async function updateAlumno(idPersona, payload) {
  return getProvider().actualizarAlumno(idPersona, payload)
}

export async function setAlumnoEstado(idPersona, nuevoEstado) {
  return getProvider().cambiarEstadoAlumno(idPersona, nuevoEstado)
}

export async function fetchMiPerfilAlumno(personaId) {
  return getProvider().getMiPerfilAlumno(personaId)
}
