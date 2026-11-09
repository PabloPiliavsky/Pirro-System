// Anchored to REQ-RUT-008, REQ-RUT-010
import { HStack } from '@/components/ui/HStack'

export function ConstructorAlumnoBadges({ alumno, onAbrirFicha }) {
  if (!alumno) return null

  return (
    <HStack className="flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-secondary/50 border border-border px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground">
        <span className="text-muted-foreground">Sede:</span>
        <span className="text-primary font-bold">
          {alumno.gimnasio?.nombre || 'Sin Sede Asignada'}
        </span>
      </div>

      <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold text-primary">
        {alumno.cantidad_dias_rutina} Días / Sem
      </div>

      {alumno.salud_enfermedades && (
        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <span>⚠️</span> Condición médica
        </span>
      )}

      <button
        type="button"
        onClick={() => onAbrirFicha(alumno)}
        className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 border border-border shadow-sm flex items-center gap-2"
      >
        <span>📋</span> Ver Ficha Médica
      </button>
    </HStack>
  )
}

export default ConstructorAlumnoBadges
