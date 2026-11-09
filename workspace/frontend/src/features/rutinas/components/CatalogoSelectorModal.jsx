// Anchored to REQ-RUT-006, REQ-RUT-009
import { useCatalogoSelector } from '../hooks/useCatalogoSelector'
import { checkDisponibilidadEquipamiento } from '../utils/equipamientoChecker'

export function CatalogoSelectorModal({ isOpen, onClose, onAgregarEjercicio, gimnasio }) {
  const {
    ejerciciosFiltrados,
    loading,
    busqueda,
    setBusqueda,
    grupoSeleccionado,
    setGrupoSeleccionado,
    grupos,
  } = useCatalogoSelector()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-lg font-black text-foreground">Catálogo de Ejercicios</h3>
            <p className="text-xs text-muted-foreground">Selecciona ejercicios para sumar a la rutina</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground flex items-center justify-center font-bold text-sm cursor-pointer active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-3 shrink-0">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o indicación..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {grupos.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrupoSeleccionado(g)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  grupoSeleccionado === g
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {loading && <p className="text-xs text-muted-foreground text-center py-8">Cargando catálogo...</p>}
          {!loading && ejerciciosFiltrados.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">No se encontraron ejercicios.</p>
          )}
          {!loading &&
            ejerciciosFiltrados.map((ej) => {
              const eqStatus = checkDisponibilidadEquipamiento(ej, gimnasio)
              return (
                <div
                  key={ej.id}
                  className="bg-secondary/30 hover:bg-secondary/60 border border-border/60 rounded-xl p-3 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground truncate">{ej.nombre}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                        {ej.grupo_muscular}
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
                    onClick={() => onAgregarEjercicio(ej)}
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
                  >
                    + Agregar
                  </button>
                </div>
              )
            })}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">
            {ejerciciosFiltrados.length} ejercicios disponibles
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs cursor-pointer active:scale-95 transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  )
}

export default CatalogoSelectorModal
