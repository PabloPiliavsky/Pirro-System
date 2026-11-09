// Anchored to REQ-RUT-006, REQ-RUT-009
import { useState } from 'react'
import { checkDisponibilidadEquipamiento } from '../utils/equipamientoChecker'

export function CatalogoItemRow({ ejercicio, gimnasio, ejerciciosDia = [], onAgregar }) {
  const [recienAgregado, setRecienAgregado] = useState(false)
  const eqStatus = checkDisponibilidadEquipamiento(ejercicio, gimnasio)

  const cantidadEnDia = ejerciciosDia.filter(
    (item) => Number(item.id_ejercicio) === Number(ejercicio.id)
  ).length

  function handleClick() {
    onAgregar(ejercicio)
    setRecienAgregado(true)
    setTimeout(() => {
      setRecienAgregado(false)
    }, 1200)
  }

  const botonTexto = recienAgregado
    ? '✓ ¡Sumado!'
    : cantidadEnDia > 0
    ? '+ Sumar otro'
    : '+ Agregar'

  const botonColor = recienAgregado
    ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
    : cantidadEnDia > 0
    ? 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
    : 'bg-primary hover:bg-primary/90 text-primary-foreground'

  return (
    <div className="bg-secondary/30 hover:bg-secondary/60 border border-border/60 rounded-xl p-3 flex items-center justify-between gap-3 transition-all">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-foreground truncate">{ejercicio.nombre}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
            {ejercicio.grupo_muscular}
          </span>
          {cantidadEnDia > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              ✓ En rutina ({cantidadEnDia})
            </span>
          )}
        </div>
        {eqStatus.advertencia && (
          <p className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
            {eqStatus.mensaje}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleClick}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm ${botonColor}`}
      >
        {botonTexto}
      </button>
    </div>
  )
}

export default CatalogoItemRow
