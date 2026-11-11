// Anchored to REQ-TRN-001, REQ-TRN-007, REQ-TRN-009, REQ-TRN-011
// TODO: [MOCK-CLEANUP] Retirar consumo mediante getProvider() y conectar directamente a supabaseAdapter cuando se retire mockAdapter.
import { getProvider } from './dataProvider'

export async function getRutinasAlumno(idAlumno) {
  return getProvider().getRutinasByAlumno(idAlumno)
}

export async function guardarBatch(payload) {
  return getProvider().guardarEntrenamientoBatch(payload)
}

export async function getHistorialAlumno(idAlumno) {
  return getProvider().getHistorialByAlumno(idAlumno)
}
