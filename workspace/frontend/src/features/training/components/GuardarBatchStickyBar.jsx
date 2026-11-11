// Anchored to REQ-TRN-007, REQ-TRN-008, REQ-TRN-010, REQ-TRN-012
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { Save, Loader2, Trophy } from 'lucide-react'

export function GuardarBatchStickyBar({
  completedCount,
  totalSeriesCount,
  isSaving,
  onSaveBatch,
}) {
  const hasSeries = completedCount > 0

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 p-3 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="max-w-md mx-auto">
        <HStack justify="between" align="center" className="gap-3">
          <VStack className="gap-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">Progreso Sesión</span>
            <HStack align="center" className="gap-1">
              <Trophy className="size-3.5 text-primary" />
              <span className="text-sm font-black text-foreground">
                {completedCount} / {totalSeriesCount} series
              </span>
            </HStack>
          </VStack>

          <Button
            type="button"
            disabled={!hasSeries || isSaving}
            onClick={onSaveBatch}
            className="min-h-12 px-5 rounded-xl font-bold bg-primary text-primary-foreground shadow-md cursor-pointer select-none active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <HStack align="center" className="gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Guardando...</span>
              </HStack>
            ) : (
              <HStack align="center" className="gap-2">
                <Save className="size-4" />
                <span>Guardar Entrenamiento</span>
              </HStack>
            )}
          </Button>
        </HStack>
      </div>
    </div>
  )
}
