// Anchored to REQ-FND-008, REQ-FND-013, REQ-FND-014
import { PlusCircle, Save, HardDrive, CheckCircle2 } from 'lucide-react'
import { useRoutineLocalStorage } from '@/features/training/hooks/useRoutineLocalStorage'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export function BatchSyncSandbox({ onBatchSaved }) {
  const { draft, isSaving, lastResult, saveSerieDraft, commitBatch } = useRoutineLocalStorage(2, 1)

  function handleAddDemoSerie() {
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

  async function handleCommit() {
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
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-secondary/50 p-3 font-mono text-xs">
          <span>Borrador en localStorage: {draft.series.length} serie(s)</span>
          <span className="truncate text-muted-foreground">
            UUID: {draft.clientSubmissionId.slice(0, 12)}...
          </span>
        </div>
        {draft.series.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.series.map((s) => (
              <Badge key={s.numeroSerie} variant="secondary" className="font-mono">
                S{s.numeroSerie}: {s.repeticionesRealizadas} reps @ {s.pesoUtilizado}kg
              </Badge>
            ))}
          </div>
        )}
        {lastResult?.ok && (
          <Alert>
            <AlertTitle className="flex items-center gap-1.5 text-primary">
              <CheckCircle2 className="size-4" />
              Transacción Batch Confirmada (Registro #{lastResult.idRegistro})
            </AlertTitle>
            <AlertDescription>
              El borrador local se limpió tras confirmar la escritura atómica de las series.
            </AlertDescription>
          </Alert>
        )}
        {lastResult && !lastResult.ok && (
          <Alert variant="destructive">
            <AlertTitle className="font-semibold">Error al guardar sesión</AlertTitle>
            <AlertDescription>
              {lastResult.error?.message || 'Error desconocido al intentar guardar el batch.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handleAddDemoSerie}>
          <PlusCircle data-icon="inline-start" />
          Cargar Serie en LocalStorage
        </Button>
        <Button
          disabled={draft.series.length === 0 || isSaving}
          onClick={handleCommit}
        >
          <Save data-icon="inline-start" />
          Guardar Entrenamiento (Batch)
        </Button>
      </CardFooter>
    </Card>
  )
}
