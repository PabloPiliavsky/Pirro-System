// Anchored to REQ-RUT-005, REQ-RUT-006, REQ-RUT-008
import { checkDisponibilidadEquipamiento } from '../utils/equipamientoChecker'

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
    <div className="bg-card/90 border border-border rounded-2xl p-4 shadow-sm hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary text-foreground text-xs font-black shrink-0">
          {item.orden}
        </span>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-foreground truncate">{ej.nombre || 'Ejercicio'}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
              {ej.grupo_muscular || 'General'}
            </span>
            {statusEq.advertencia && (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                {statusEq.mensaje}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-w-lg">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Series</label>
              <input
                type="number"
                min="1"
                max="20"
                value={item.series_objetivo}
                onChange={(e) => onActualizar(index, 'series_objetivo', Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Repeticiones</label>
              <input
                type="text"
                value={item.repeticiones_objetivo}
                onChange={(e) => onActualizar(index, 'repeticiones_objetivo', e.target.value)}
                placeholder="10-12"
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Notas / Tempo</label>
              <input
                type="text"
                value={item.notas_profesor || ''}
                onChange={(e) => onActualizar(index, 'notas_profesor', e.target.value)}
                placeholder="Indicaciones..."
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center self-end md:self-center gap-1.5 shrink-0 pt-2 md:pt-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMover(index, 'arriba')}
          title="Mover arriba"
          className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs font-bold"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMover(index, 'abajo')}
          title="Mover abajo"
          className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs font-bold"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={() => onEliminar(index)}
          title="Quitar de la rutina"
          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default RutinaEjercicioItem
