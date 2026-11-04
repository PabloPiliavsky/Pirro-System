// Anchored to REQ-EJE-001, REQ-EJE-006
import { EjercicioCard } from './EjercicioCard'

export function EjerciciosGrid({ ejercicios, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        Cargando catálogo de ejercicios...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ejercicios.map((ej) => (
        <EjercicioCard
          key={ej.id}
          ejercicio={ej}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {ejercicios.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-500 text-sm">
          No se encontraron ejercicios con los filtros seleccionados.
        </div>
      )}
    </div>
  )
}
