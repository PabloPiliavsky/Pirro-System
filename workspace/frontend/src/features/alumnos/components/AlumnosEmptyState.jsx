// Anchored to REQ-ALU-007
import { VStack } from '@/components/ui/VStack'

export function AlumnosEmptyState() {
  return (
    <VStack align="center" justify="center" className="py-16 text-muted-foreground gap-2 border border-dashed border-border/60 rounded-2xl bg-card/40">
      <span className="text-3xl">👤</span>
      <span className="text-sm font-semibold text-foreground">No se encontraron alumnos</span>
      <span className="text-xs">Probá cambiando los filtros o agregá un nuevo alumno.</span>
    </VStack>
  )
}
