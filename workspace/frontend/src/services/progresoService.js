// Anchored to REQ-PRG-001, REQ-PRG-002, REQ-PRG-003, REQ-PRG-012
// TODO: [MOCK-CLEANUP] Retirar consumo mediante getProvider() y conectar directamente a supabaseAdapter cuando se retire mockAdapter.
import { getProvider } from './dataProvider'

export async function fetchAlumnosProgreso() {
  return getProvider().getAlumnos()
}

export async function fetchReporteProgresoAlumno(idAlumno) {
  const provider = getProvider()
  const [alumno, rutinas, historial] = await Promise.all([
    provider.getAlumnoById(Number(idAlumno)),
    provider.getRutinasByAlumno(Number(idAlumno)),
    provider.getHistorialByAlumno(Number(idAlumno)),
  ])

  return {
    alumno: alumno || null,
    rutinas: rutinas || [],
    historial: historial || [],
  }
}
