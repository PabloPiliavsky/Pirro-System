// TODO: [MOCK-CLEANUP] Eliminar esta barra de desarrollo cuando finalice la migración a Supabase.
// Anchored to REQ-FND-003, REQ-FND-010, REQ-FND-014
import { Database, RotateCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function DevDataToolbarExpanded({
  mode,
  statusMessage,
  onCollapse,
  onSwitchMode,
  onResetSeed,
}) {
  return (
    <VStack className="gap-2 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
      <HStack justify="between" className="gap-4">
        <HStack className="gap-1.5">
          <Database className="size-3.5 text-primary" />
          <span className="font-semibold text-foreground">Entorno DEV</span>
        </HStack>
        <button
          type="button"
          aria-label="Minimizar barra DEV"
          onClick={onCollapse}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </HStack>
      <HStack className="gap-1.5">
        <Button
          size="sm"
          variant={mode === 'mock' ? 'default' : 'secondary'}
          onClick={() => onSwitchMode('mock')}
        >
          MOCK LOCAL
        </Button>
        <Button
          size="sm"
          variant={mode === 'supabase' ? 'default' : 'secondary'}
          onClick={() => onSwitchMode('supabase')}
        >
          SUPABASE
        </Button>
        {mode === 'mock' && (
          <Button size="sm" variant="outline" onClick={onResetSeed}>
            <RotateCcw data-icon="inline-start" />
            Restaurar Semilla
          </Button>
        )}
      </HStack>
      {statusMessage && (
        <Badge variant="secondary" className="justify-center text-[11px]">
          {statusMessage}
        </Badge>
      )}
    </VStack>
  )
}
