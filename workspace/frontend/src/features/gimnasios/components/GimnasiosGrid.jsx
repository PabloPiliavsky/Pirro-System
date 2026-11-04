// Anchored to REQ-GYM-001, REQ-GYM-006
import { GimnasioCard } from './GimnasioCard'

export function GimnasiosGrid({ gimnasios, loading, onEdit, onDelete, onReactivate }) {
  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        Cargando sedes y equipamiento...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gimnasios.map((gym) => (
        <GimnasioCard
          key={gym.id}
          gimnasio={gym}
          onEdit={onEdit}
          onDelete={onDelete}
          onReactivate={onReactivate}
        />
      ))}
      {gimnasios.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-500 text-sm">
          No hay gimnasios para el filtro seleccionado.
        </div>
      )}
    </div>
  )
}
