// Anchored to REQ-FND-008, REQ-FND-013
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'

export function BatchSyncDraftInfo({ draft }) {
  return (
    <>
      <HStack
        wrap
        justify="between"
        className="gap-2 rounded-lg border border-border bg-secondary/50 p-3 font-mono text-xs"
      >
        <span>Borrador en localStorage: {draft.series.length} serie(s)</span>
        <span className="truncate text-muted-foreground">
          UUID: {draft.clientSubmissionId.slice(0, 12)}...
        </span>
      </HStack>
      {draft.series.length > 0 && (
        <HStack wrap className="gap-2">
          {draft.series.map((s) => (
            <Badge key={s.numeroSerie} variant="secondary" className="font-mono">
              S{s.numeroSerie}: {s.repeticionesRealizadas} reps @ {s.pesoUtilizado}kg
            </Badge>
          ))}
        </HStack>
      )}
    </>
  )
}
