// Anchored to REQ-FND-008, REQ-FND-013, REQ-FND-014
import { HardDrive } from 'lucide-react'
import { useRoutineLocalStorage } from '@/features/training/hooks/useRoutineLocalStorage'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BatchSyncDraftInfo } from './BatchSyncDraftInfo'
import { BatchSyncAlerts } from './BatchSyncAlerts'
import { BatchSyncActions } from './BatchSyncActions'

export function BatchSyncSandbox({ onBatchSaved }) {
  const { draft, isSaving, lastResult, saveSerieDraft, commitBatch } = useRoutineLocalStorage(2, 1)

  const handleAddDemoSerie = () => {
    const nextNumber = draft.series.length + 1
    saveSerieDraft({
      idEjercicio: 1,
      numeroSerie: nextNumber,
      repeticionesObjetivo: '8-10',
      repeticionesRealizadas: 10,
      pesoUtilizado: 30 + nextNumber * 2.5,
      comentarioAlumno: `Serie ${nextNumber} guardada en borrador local`,
    })
  }

  const handleCommit = async () => {
    const res = await commitBatch()
    if (res.ok && onBatchSaved) onBatchSaved()
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="size-4 text-primary" />
            <span>Laboratorio Offline-First & Guardado Batch</span>
          </CardTitle>
          <Badge variant="accent" className="font-mono">
            0 llamadas a BD por serie
          </Badge>
        </div>
        <CardDescription>
          Simulador interactivo del entrenamiento de Martín Gómez (Día 1: Press Plano). Al hacer clic abajo se agrega una serie al borrador local (sin tocar la BD). Al tocar &ldquo;Guardar Entrenamiento&rdquo;, se envía el bloque completo en 1 sola transacción.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <BatchSyncDraftInfo draft={draft} />
        <BatchSyncAlerts lastResult={lastResult} />
      </CardContent>
      <CardFooter>
        <BatchSyncActions
          onAddSerie={handleAddDemoSerie}
          onCommit={handleCommit}
          isSaving={isSaving}
          hasSeries={draft.series.length > 0}
        />
      </CardFooter>
    </Card>
  )
}
