// Anchored to REQ-RUT-001, REQ-RUT-003, REQ-RUT-011
// TODO: [MOCK-CLEANUP] Retirar consumo mediante getProvider() y conectar directamente a supabaseAdapter cuando se retire mockAdapter.
import { getProvider } from './dataProvider'

export async function fetchRutinasByAlumno(idAlumno) {
  return getProvider().getRutinasByAlumno(idAlumno)
}

export async function saveRutinaCompleta(payload) {
  return getProvider().guardarRutinaCompleta(payload)
}

export async function removeRutina(idRutina) {
  return getProvider().eliminarRutina(idRutina)
}
