// Anchored to REQ-FND-008, REQ-FND-012, REQ-FND-013

export function createEmptyDraft(idAlumno, idRutina) {
  return {
    clientSubmissionId: crypto.randomUUID(),
    idAlumno: Number(idAlumno),
    idRutina: Number(idRutina),
    fechaRealizacion: new Date().toISOString().slice(0, 10),
    series: [],
  }
}
