// Anchored to REQ-FND-008, REQ-FND-012, REQ-FND-013

export function getDraftStorageKey(idAlumno, idRutina) {
  return `pirro_draft_${idAlumno}_${idRutina}`
}
