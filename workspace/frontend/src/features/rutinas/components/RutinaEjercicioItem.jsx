// Anchored to REQ-RUT-005, REQ-RUT-006, REQ-RUT-008
import { checkDisponibilidadEquipamiento } from '../utils/equipamientoChecker'
import { RutinaEjercicioAcciones } from './RutinaEjercicioAcciones'
import { RutinaEjercicioCampos } from './RutinaEjercicioCampos'

export function RutinaEjercicioItem({
  item,
  index,
  total,
  gimnasio,
  onActualizar,
  onMover,
  onEliminar,
}) {
  const ej = item.ejercicio || {}
  const statusEq = checkDisponibilidadEquipamiento(ej, gimnasio)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-black shrink-0">
          #{item.orden}
        </span>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-white truncate">{ej.nombre}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {ej.grupo_muscular}
            </span>
            {statusEq.advertencia && (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                {statusEq.mensaje}
              </span>
            )}
          </div>

          <RutinaEjercicioCampos
            item={item}
            index={index}
            onActualizar={onActualizar}
          />
        </div>
      </div>

      <RutinaEjercicioAcciones
        index={index}
        total={total}
        onMover={onMover}
        onEliminar={onEliminar}
      />
    </div>
  )
}

export default RutinaEjercicioItem
