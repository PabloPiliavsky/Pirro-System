// Anchored to REQ-EJE-001, REQ-EJE-002, REQ-EJE-005, REQ-GYM-007
import { getProvider } from './dataProvider'

export async function fetchEjercicios() {
  return getProvider().getEjercicios()
}

export async function saveEjercicio(payload) {
  return getProvider().guardarEjercicio(payload)
}

export async function removeEjercicio(id) {
  return getProvider().eliminarEjercicio(id)
}
