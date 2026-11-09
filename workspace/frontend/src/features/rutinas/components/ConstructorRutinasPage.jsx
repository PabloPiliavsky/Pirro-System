// Anchored to REQ-RUT-008, REQ-RUT-010, REQ-RUT-011
import { useState, useEffect } from 'react'
import { fetchAlumnos } from '../../../services/alumnosService'
import { useConstructorRutinas } from '../hooks/useConstructorRutinas'
import { ConstructorAlumnoHeader } from './ConstructorAlumnoHeader'
import { ConstructorDiasTabs } from './ConstructorDiasTabs'
import { RutinaEditorPanel } from './RutinaEditorPanel'
import { CatalogoSelectorModal } from './CatalogoSelectorModal'
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
    fetchAlumnos().then((data) => {
      const activos = (data || []).filter((a) => a.estado !== false)
      setAlumnos(activos)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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

      {mensaje && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold border transition-all ${
            mensaje.tipo === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {alumno ? (
        <div className="space-y-5">
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
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-card/40 border border-border rounded-2xl">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="text-base font-bold text-foreground">Ningún alumno seleccionado</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Selecciona un alumno en el menú superior para comenzar a armar su rutina semanal.
          </p>
        </div>
      )}

      <CatalogoSelectorModal
        isOpen={modalCatalogo}
        onClose={() => setModalCatalogo(false)}
        onAgregarEjercicio={agregarEjercicio}
        gimnasio={alumno?.gimnasio}
      />

      <FichaMedicaModal alumno={alumnoFicha} onClose={() => setAlumnoFicha(null)} />
    </div>
  )
}

export default ConstructorRutinasPage
