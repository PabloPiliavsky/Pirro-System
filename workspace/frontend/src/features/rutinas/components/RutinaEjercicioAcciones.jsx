// Anchored to REQ-RUT-005, REQ-RUT-008
import { HStack } from '@/components/ui/HStack'

export function RutinaEjercicioAcciones({ index, total, onMover, onEliminar }) {
  return (
    <HStack className="self-end md:self-center gap-1.5 shrink-0 pt-2 md:pt-0">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMover(index, 'arriba')}
        title="Mover arriba"
        className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs font-bold"
      >
        ▲
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMover(index, 'abajo')}
        title="Mover abajo"
        className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs font-bold"
      >
        ▼
      </button>
      <button
        type="button"
        onClick={() => onEliminar(index)}
        title="Quitar de la rutina"
        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs"
      >
        🗑️
      </button>
    </HStack>
  )
}

export default RutinaEjercicioAcciones
