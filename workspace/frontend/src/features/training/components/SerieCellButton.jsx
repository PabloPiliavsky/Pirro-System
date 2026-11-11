// Anchored to REQ-TRN-003, REQ-TRN-010, REQ-TRN-012
import { Check } from 'lucide-react'
import { VStack } from '@/components/ui/VStack'
import { HStack } from '@/components/ui/HStack'

export function SerieCellButton({ numeroSerie, repeticionesObjetivo, completedSerie, onSelect }) {
  const isCompleted = Boolean(completedSerie)

  return (
    <button
      type="button"
      onClick={() => onSelect(numeroSerie)}
      className={`min-h-12 min-w-16 flex-1 px-2 py-1.5 rounded-xl border text-center transition-all cursor-pointer select-none active:scale-95 ${
        isCompleted
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-semibold shadow-sm'
          : 'bg-muted/30 hover:bg-muted/60 border-border text-foreground'
      }`}
    >
      <VStack align="center" justify="center" className="gap-0.5">
        <HStack align="center" className="gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            S{numeroSerie}
          </span>
          {isCompleted && <Check className="size-3 text-emerald-400" />}
        </HStack>
        <span className="text-xs font-bold leading-tight">
          {isCompleted
            ? `${completedSerie.repeticionesRealizadas}r · ${completedSerie.pesoUtilizado}kg`
            : `${repeticionesObjetivo} reps`}
        </span>
      </VStack>
    </button>
  )
}
