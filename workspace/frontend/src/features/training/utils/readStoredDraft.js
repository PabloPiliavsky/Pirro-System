// Anchored to REQ-FND-008, REQ-FND-012, REQ-FND-013
import { getDraftStorageKey } from './getDraftStorageKey'
import { createEmptyDraft } from './createEmptyDraft'

export function readStoredDraft(idAlumno, idRutina) {
  const key = getDraftStorageKey(idAlumno, idRutina)
  const raw = localStorage.getItem(key)
  if (!raw) {
    const initial = createEmptyDraft(idAlumno, idRutina)
    localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(raw)
}
