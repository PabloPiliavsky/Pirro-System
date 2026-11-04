// Anchored to REQ-EJE-006
import { HStack } from '@/components/ui/HStack'

export function EjercicioCardTags({ ejercicio }) {
  const eqName = ejercicio.equipamiento_requerido?.nombre || null

  return (
    <HStack wrap className="gap-2 mb-3">
      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-lg uppercase tracking-wider">
        {ejercicio.grupo_muscular}
      </span>
      {ejercicio.requiere_equipamiento ? (
        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs rounded-lg flex items-center gap-1">
          <span>⚙️</span>
          <span>{eqName || `Máquina #${ejercicio.id_equipamiento_requerido}`}</span>
        </span>
      ) : (
        <span className="px-2.5 py-1 bg-slate-800/50 text-slate-400 border border-slate-800 text-xs rounded-lg">
          Peso corporal / Libre
        </span>
      )}
    </HStack>
  )
}
