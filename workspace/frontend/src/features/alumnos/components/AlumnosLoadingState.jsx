// Anchored to REQ-ALU-007
import { VStack } from '@/components/ui/VStack'

export function AlumnosLoadingState() {
  return (
    <VStack align="center" justify="center" className="py-20 text-muted-foreground gap-3">
      <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="text-sm">Cargando alumnos...</span>
    </VStack>
  )
}
