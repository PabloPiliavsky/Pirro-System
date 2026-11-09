// Anchored to REQ-RUT-008
import { VStack } from '@/components/ui/VStack'

export function ConstructorEmptyState() {
  return (
    <VStack className="text-center py-16 px-4 bg-card/40 border border-border rounded-2xl">
      <p className="text-4xl mb-3">📋</p>
      <h3 className="text-base font-bold text-foreground">Ningún alumno seleccionado</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        Selecciona un alumno en el menú superior para comenzar a armar su rutina semanal.
      </p>
    </VStack>
  )
}

export default ConstructorEmptyState
