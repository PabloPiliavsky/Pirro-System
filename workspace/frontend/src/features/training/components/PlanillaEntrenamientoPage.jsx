// Anchored to REQ-TRN-001, REQ-TRN-002, REQ-TRN-003, REQ-TRN-007, REQ-TRN-010, REQ-TRN-012
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getRutinasAlumno } from '@/services/entrenamientoService'
import { useRoutineLocalStorage } from '../hooks/useRoutineLocalStorage'
import { EntrenamientoHeader } from './EntrenamientoHeader'
import { EjercicioCard } from './EjercicioCard'
import { SerieInputModal } from './SerieInputModal'
import { GuardarBatchStickyBar } from './GuardarBatchStickyBar'
import { PlanillaFeedbackAlert } from './PlanillaFeedbackAlert'
import { PlanillaVaciaCard } from './PlanillaVaciaCard'
import { VStack } from '@/components/ui/VStack'

export function PlanillaEntrenamientoPage() {
  const { user } = useAuth()
  const idAlumno = user?.idPersona || user?.persona?.id || 2
  const [rutinas, setRutinas] = useState([])
  const [selectedRutinaId, setSelectedRutinaId] = useState(null)
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [modal, setModal] = useState({ isOpen: false, item: null, serieNum: 1 })
  const [feedback, setFeedback] = useState(null)

  const { draft, isSaving, saveSerieDraft, updateFechaRealizacion, commitBatch } =
    useRoutineLocalStorage(idAlumno, selectedRutinaId || 0)

  useEffect(() => {
    getRutinasAlumno(idAlumno).then((data) => {
      setRutinas(data || [])
      if (data && data.length > 0) setSelectedRutinaId(data[0].id)
    })
  }, [idAlumno])

  useEffect(() => {
    setFeedback(null)
  }, [selectedRutinaId, fecha])

  const activeRutina = rutinas.find((r) => r.id === selectedRutinaId)
  const totalSeries = (activeRutina?.ejercicios || []).reduce((acc, e) => acc + e.series_objetivo, 0)
  const activeCompleted = draft.series.filter((s) =>
    (activeRutina?.ejercicios || []).some((e) => Number(e.id_ejercicio) === Number(s.idEjercicio))
  )

  const handleOpenModal = (item, serieNum) => {
    setModal({ isOpen: true, item, serieNum })
  }

  const handleSaveBatch = async () => {
    const res = await commitBatch()
    setFeedback(res)
  }

  if (rutinas.length === 0) return <PlanillaVaciaCard />

  return (
    <VStack className="gap-4 pb-32">
      <EntrenamientoHeader
        rutinas={rutinas}
        selectedRutinaId={selectedRutinaId}
        onSelectRutinaId={setSelectedRutinaId}
        fechaRealizacion={fecha}
        onChangeFecha={(f) => {
          setFecha(f)
          updateFechaRealizacion(f)
        }}
      />

      <PlanillaFeedbackAlert result={feedback} onDismiss={() => setFeedback(null)} />

      <VStack className="gap-3">
        {(activeRutina?.ejercicios || []).map((item) => (
          <EjercicioCard
            key={item.id}
            item={item}
            draftSeries={draft.series}
            onOpenModal={handleOpenModal}
          />
        ))}
      </VStack>

      <GuardarBatchStickyBar
        completedCount={activeCompleted.length}
        totalSeriesCount={totalSeries}
        isSaving={isSaving}
        onSaveBatch={handleSaveBatch}
      />

      <SerieInputModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, item: null, serieNum: 1 })}
        item={modal.item}
        numeroSerie={modal.serieNum}
        initialSerie={draft.series.find(
          (s) =>
            Number(s.idEjercicio) === Number(modal.item?.id_ejercicio) &&
            Number(s.numeroSerie) === Number(modal.serieNum)
        )}
        onSave={saveSerieDraft}
      />
    </VStack>
  )
}
