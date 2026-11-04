// Anchored to REQ-FND-008, REQ-FND-012, REQ-FND-013
import { useState } from 'react'
import { getProvider } from '@/services/dataProvider'
import { getDraftStorageKey } from '../utils/getDraftStorageKey'
import { createEmptyDraft } from '../utils/createEmptyDraft'
import { readStoredDraft } from '../utils/readStoredDraft'

export function useRoutineLocalStorage(idAlumno, idRutina) {
  const [draft, setDraft] = useState(() => readStoredDraft(idAlumno, idRutina))
  const [isSaving, setIsSaving] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const saveSerieDraft = (serieInput) => {
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
  }

  const clearDraft = () => {
    const fresh = createEmptyDraft(idAlumno, idRutina)
    localStorage.setItem(getDraftStorageKey(idAlumno, idRutina), JSON.stringify(fresh))
    setDraft(fresh)
    return fresh
  }

  const commitBatch = async () => {
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
  }

  return {
    draft,
    isSaving,
    lastResult,
    saveSerieDraft,
    clearDraft,
    commitBatch,
  }
}
