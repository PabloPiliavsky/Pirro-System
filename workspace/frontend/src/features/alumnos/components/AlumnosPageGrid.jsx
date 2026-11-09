// Anchored to REQ-ALU-007
import { AlumnoCard } from './AlumnoCard'
import { VStack } from '@/components/ui/VStack'

export function AlumnosPageGrid({
  loading,
  error,
  alumnos,
  onVerFicha,
  onEdit,
  onSolicitarBaja,
  onReactivar,
}) {
  if (loading) {
    return (
      <VStack align="center" justify="center" className="py-20 text-muted-foreground gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm">Cargando alumnos...</span>
      </VStack>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-sm">
        {error}
      </div>
    )
  }

  if (alumnos.length === 0) {
    return (
      <VStack align="center" justify="center" className="py-16 text-muted-foreground gap-2 border border-dashed border-border/60 rounded-2xl bg-card/40">
        <span className="text-3xl">👤</span>
        <span className="text-sm font-semibold text-foreground">No se encontraron alumnos</span>
        <span className="text-xs">Probá cambiando los filtros o agregá un nuevo alumno.</span>
      </VStack>
    )
  }

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
