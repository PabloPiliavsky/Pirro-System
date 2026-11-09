// Anchored to REQ-RUT-006, REQ-RUT-009
import { checkDisponibilidadEquipamiento } from '../utils/equipamientoChecker'

export function CatalogoItemRow({ ejercicio, gimnasio, onAgregar }) {
  const eqStatus = checkDisponibilidadEquipamiento(ejercicio, gimnasio)

  return (
    <div className="bg-secondary/30 hover:bg-secondary/60 border border-border/60 rounded-xl p-3 flex items-center justify-between gap-3 transition-all">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-foreground truncate">{ejercicio.nombre}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
            {ejercicio.grupo_muscular}
          </span>
        </div>
        {eqStatus.advertencia && (
          <p className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
            {eqStatus.mensaje}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onAgregar(ejercicio)}
        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
      >
        + Agregar
      </button>
    </div>
  )
}

export default CatalogoItemRow
