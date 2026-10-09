// Anchored to REQ-FND-008, REQ-FND-012, REQ-FND-013
import { useCallback, useState } from 'react'
import { getProvider } from '@/services/dataProvider'

export function getDraftStorageKey(idAlumno, idRutina) {
  return `pirro_draft_${idAlumno}_${idRutina}`
}

function createEmptyDraft(idAlumno, idRutina) {
  return {
    clientSubmissionId: crypto.randomUUID(),
    idAlumno: Number(idAlumno),
    idRutina: Number(idRutina),
    fechaRealizacion: new Date().toISOString().slice(0, 10),
    series: [],
  }
}

function readStoredDraft(idAlumno, idRutina) {
  const key = getDraftStorageKey(idAlumno, idRutina)
  const raw = localStorage.getItem(key)
  if (!raw) {
    const initial = createEmptyDraft(idAlumno, idRutina)
    localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(raw)
}

export function useRoutineLocalStorage(idAlumno, idRutina) {
  const [draft, setDraft] = useState(() => readStoredDraft(idAlumno, idRutina))
  const [isSaving, setIsSaving] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const saveSerieDraft = useCallback(
    (serieInput) => {
      const current = readStoredDraft(idAlumno, idRutina)
      const filtered = current.series.filter(
        (s) =>
          !(
            Number(s.idEjercicio) === Number(serieInput.idEjercicio) &&
            Number(s.numeroSerie) === Number(serieInput.numeroSerie)
          )
      )
      const updated = {
        ...current,
        series: [
          ...filtered,
          {
            idEjercicio: Number(serieInput.idEjercicio),
            numeroSerie: Number(serieInput.numeroSerie),
            repeticionesObjetivo: String(serieInput.repeticionesObjetivo || '10'),
            repeticionesRealizadas: Number(serieInput.repeticionesRealizadas),
            pesoUtilizado: Number(serieInput.pesoUtilizado),
            comentarioAlumno: serieInput.comentarioAlumno || null,
          },
        ],
      }
      localStorage.setItem(getDraftStorageKey(idAlumno, idRutina), JSON.stringify(updated))
      setDraft(updated)
      return updated
    },
    [idAlumno, idRutina]
  )

  const clearDraft = useCallback(() => {
    const fresh = createEmptyDraft(idAlumno, idRutina)
    localStorage.setItem(getDraftStorageKey(idAlumno, idRutina), JSON.stringify(fresh))
    setDraft(fresh)
    return fresh
  }, [idAlumno, idRutina])

  const commitBatch = useCallback(async () => {
    const current = readStoredDraft(idAlumno, idRutina)
    setIsSaving(true)
    try {
      const response = await getProvider().guardarEntrenamientoBatch(current)
      setLastResult(response)
      if (response.ok) {
        clearDraft()
      }
      return response
    } finally {
      setIsSaving(false)
    }
  }, [idAlumno, idRutina, clearDraft])

  return {
    draft,
    isSaving,
    lastResult,
    saveSerieDraft,
    clearDraft,
    commitBatch,
  }
}
