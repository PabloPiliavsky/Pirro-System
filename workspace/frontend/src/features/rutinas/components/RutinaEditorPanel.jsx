// Anchored to REQ-RUT-003, REQ-RUT-005, REQ-RUT-008
import { VStack } from '@/components/ui/VStack'
import { RutinaEjercicioItem } from './RutinaEjercicioItem'
import { RutinaEditorHeader } from './RutinaEditorHeader'
import { RutinaEditorEmpty } from './RutinaEditorEmpty'

export function RutinaEditorPanel({
  diaActivo,
  nombreRutina,
  setNombreRutina,
  ejerciciosDia,
  gimnasio,
  onAbrirCatalogo,
  onActualizarEjercicio,
  onMoverEjercicio,
  onEliminarEjercicio,
  onGuardar,
  saving,
}) {
  return (
    <VStack className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
      <RutinaEditorHeader
        diaActivo={diaActivo}
        nombreRutina={nombreRutina}
        setNombreRutina={setNombreRutina}
        onAbrirCatalogo={onAbrirCatalogo}
        onGuardar={onGuardar}
        saving={saving}
      />

      <div className="space-y-3">
        {ejerciciosDia.length === 0 ? (
          <RutinaEditorEmpty diaActivo={diaActivo} onAbrirCatalogo={onAbrirCatalogo} />
        ) : (
          ejerciciosDia.map((item, idx) => (
            <RutinaEjercicioItem
              key={`${item.id_ejercicio}-${idx}`}
              item={item}
              index={idx}
              total={ejerciciosDia.length}
              gimnasio={gimnasio}
              onActualizar={onActualizarEjercicio}
              onMover={onMoverEjercicio}
              onEliminar={onEliminarEjercicio}
            />
          ))
        )}
      </div>
    </VStack>
  )
}

export default RutinaEditorPanel
