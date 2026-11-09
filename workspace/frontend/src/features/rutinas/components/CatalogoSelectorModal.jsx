// Anchored to REQ-RUT-006, REQ-RUT-009
import { useCatalogoSelector } from '../hooks/useCatalogoSelector'
import { CatalogoFiltros } from './CatalogoFiltros'
import { CatalogoItemRow } from './CatalogoItemRow'

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

        <CatalogoFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          grupos={grupos}
          grupoSeleccionado={grupoSeleccionado}
          setGrupoSeleccionado={setGrupoSeleccionado}
        />

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {loading && <p className="text-xs text-muted-foreground text-center py-8">Cargando catálogo...</p>}
          {!loading && ejerciciosFiltrados.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">No se encontraron ejercicios.</p>
          )}
          {!loading &&
            ejerciciosFiltrados.map((ej) => (
              <CatalogoItemRow
                key={ej.id}
                ejercicio={ej}
                gimnasio={gimnasio}
                onAgregar={onAgregarEjercicio}
              />
            ))}
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
