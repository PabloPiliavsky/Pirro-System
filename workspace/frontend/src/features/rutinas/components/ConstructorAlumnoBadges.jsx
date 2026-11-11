// Anchored to REQ-RUT-008, REQ-RUT-010
import { HStack } from '@/components/ui/HStack'

export function ConstructorAlumnoBadges({ alumno, onAbrirFicha }) {
  if (!alumno) return null

  return (
    <HStack wrap className="gap-2.5 items-center shrink-0">
      <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200">
        <span className="text-slate-400">Sede:</span>
        <span className="text-primary font-bold">
          {alumno.gimnasio?.nombre || 'Sin Sede Asignada'}
        </span>
      </div>

      <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold text-primary">
        ⚡ {alumno.cantidad_dias_rutina} Días / Sem
      </div>

      {alumno.salud_enfermedades && (
        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <span>⚠️</span> Ficha médica
        </span>
      )}

      <button
        type="button"
        onClick={() => onAbrirFicha(alumno)}
        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 border border-slate-700 shadow-sm flex items-center gap-1.5"
      >
        <span>📋</span> Ver Ficha Médica
      </button>
    </HStack>
  )
}

export default ConstructorAlumnoBadges
