// Anchored to REQ-ALU-007
import { AlumnoCard } from './AlumnoCard'
import { AlumnosLoadingState } from './AlumnosLoadingState'
import { AlumnosEmptyState } from './AlumnosEmptyState'

export function AlumnosPageGrid({
  loading,
  error,
  alumnos,
  onVerFicha,
  onEdit,
  onSolicitarBaja,
  onReactivar,
}) {
  if (loading) return <AlumnosLoadingState />

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-sm">
        {error}
      </div>
    )
  }

  if (alumnos.length === 0) return <AlumnosEmptyState />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {alumnos.map((alumno) => (
        <AlumnoCard
          key={alumno.id_persona}
          alumno={alumno}
          onVerFicha={onVerFicha}
          onEdit={onEdit}
          onSolicitarBaja={onSolicitarBaja}
          onReactivar={onReactivar}
        />
      ))}
    </div>
  )
}
