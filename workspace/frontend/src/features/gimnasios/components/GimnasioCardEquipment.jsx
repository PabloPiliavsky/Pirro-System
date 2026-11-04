// Anchored to REQ-GYM-006
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function GimnasioCardEquipment({ equipamientos = [] }) {
  return (
    <VStack className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Equipamiento ({equipamientos.length})
      </p>
      <HStack wrap className="gap-1.5 max-h-24 overflow-y-auto">
        {equipamientos.length > 0 ? (
          equipamientos.map((item) => (
            <span
              key={item.id_equipamiento}
              className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700"
            >
              {item.equipamiento?.nombre || `Equipo #${item.id_equipamiento}`}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic">Sin equipamiento asignado</span>
        )}
      </HStack>
    </VStack>
  )
}
