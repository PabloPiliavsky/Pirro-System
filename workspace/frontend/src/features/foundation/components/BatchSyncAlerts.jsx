// Anchored to REQ-FND-008, REQ-FND-013
import { CheckCircle2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export function BatchSyncAlerts({ lastResult }) {
  if (!lastResult) return null

  if (lastResult.ok) {
    return (
      <Alert>
        <AlertTitle className="flex items-center gap-1.5 text-primary">
          <CheckCircle2 className="size-4" />
          Transacción Batch Confirmada (Registro #{lastResult.idRegistro})
        </AlertTitle>
        <AlertDescription>
          El borrador local se limpió tras confirmar la escritura atómica de las series.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertTitle className="font-semibold">Error al guardar sesión</AlertTitle>
      <AlertDescription>
        {lastResult.error?.message || 'Error desconocido al intentar guardar el batch.'}
      </AlertDescription>
    </Alert>
  )
}
