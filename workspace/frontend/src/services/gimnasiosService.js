// Anchored to REQ-GYM-001, REQ-GYM-002, REQ-GYM-004, REQ-GYM-005, REQ-GYM-007
import { getProvider } from './dataProvider'

export async function fetchGimnasios() {
  return getProvider().getGimnasios()
}

export async function fetchEquipamientoMaestro() {
  return getProvider().getEquipamientoMaestro()
}

export async function saveGimnasio(payload) {
  return getProvider().guardarGimnasio(payload)
}

export async function removeGimnasio(id) {
  return getProvider().eliminarGimnasio(id)
}

export async function saveNewEquipamiento(payload) {
  return getProvider().guardarEquipamiento(payload)
}
