// Anchored to REQ-RUT-008, REQ-RUT-010, REQ-RUT-011
import { useState, useEffect } from 'react'
import { VStack } from '@/components/ui/VStack'
import { fetchAlumnos } from '../../../services/alumnosService'
import { useConstructorRutinas } from '../hooks/useConstructorRutinas'
import { ConstructorAlumnoHeader } from './ConstructorAlumnoHeader'
import { ConstructorDiasTabs } from './ConstructorDiasTabs'
import { RutinaEditorPanel } from './RutinaEditorPanel'
import { CatalogoSelectorModal } from './CatalogoSelectorModal'
import { ConstructorFeedbackAlert } from './ConstructorFeedbackAlert'
import { ConstructorEmptyState } from './ConstructorEmptyState'
import { FichaMedicaModal } from '../../alumnos/components/FichaMedicaModal'

export function ConstructorRutinasPage() {
  const [alumnos, setAlumnos] = useState([])
  const [modalCatalogo, setModalCatalogo] = useState(false)
  const [alumnoFicha, setAlumnoFicha] = useState(null)

  const {
    alumno,
    setAlumno,
    cantidadDias,
    diaActivo,
    setDiaActivo,
    nombreRutina,
    setNombreRutina,
    ejerciciosDia,
    rutinasSemana,
    saving,
    mensaje,
    agregarEjercicio,
    actualizarEjercicio,
    moverEjercicio,
    eliminarEjercicio,
    guardarRutina,
  } = useConstructorRutinas()

  useEffect(() => {
    fetchAlumnos()
      .then((data) => {
        const activos = (data || []).filter((a) => a.estado)
        setAlumnos(activos)
      })
      .catch(() => {
        setAlumnos([])
      })
  }, [])

  return (
    <VStack className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">
          Constructor de Rutinas
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Planifica y organiza el entrenamiento semanal por alumno y día
        </p>
      </div>

      <ConstructorAlumnoHeader
        alumnos={alumnos}
        alumnoSeleccionado={alumno}
        onSeleccionarAlumno={setAlumno}
        onAbrirFicha={setAlumnoFicha}
      />

      <ConstructorFeedbackAlert mensaje={mensaje} />

      {alumno ? (
        <VStack className="space-y-5">
          <ConstructorDiasTabs
            cantidadDias={cantidadDias}
            diaActivo={diaActivo}
            onSeleccionarDia={setDiaActivo}
            rutinasSemana={rutinasSemana}
          />

          <RutinaEditorPanel
            diaActivo={diaActivo}
            nombreRutina={nombreRutina}
            setNombreRutina={setNombreRutina}
            ejerciciosDia={ejerciciosDia}
            gimnasio={alumno.gimnasio}
            onAbrirCatalogo={() => setModalCatalogo(true)}
            onActualizarEjercicio={actualizarEjercicio}
            onMoverEjercicio={moverEjercicio}
            onEliminarEjercicio={eliminarEjercicio}
            onGuardar={guardarRutina}
            saving={saving}
          />
        </VStack>
      ) : (
        <ConstructorEmptyState />
      )}

      <CatalogoSelectorModal
        isOpen={modalCatalogo}
        onClose={() => setModalCatalogo(false)}
        onAgregarEjercicio={agregarEjercicio}
        gimnasio={alumno?.gimnasio}
      />

      <FichaMedicaModal alumno={alumnoFicha} onClose={() => setAlumnoFicha(null)} />
    </VStack>
  )
}

export default ConstructorRutinasPage
