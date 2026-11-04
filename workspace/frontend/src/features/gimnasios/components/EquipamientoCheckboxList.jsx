// Anchored to REQ-GYM-002
import { HStack } from '@/components/ui/HStack'

export function EquipamientoCheckboxList({
  equipamientoList = [],
  selectedEq = [],
  onToggleEq,
}) {
  return (
    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
      {equipamientoList.map((eq) => {
        const checked = selectedEq.includes(eq.id)
        return (
          <label
            key={eq.id}
            className="flex items-center gap-2 text-xs text-slate-300 p-1.5 rounded hover:bg-slate-900 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleEq(eq.id)}
              className="rounded bg-slate-900 border-slate-700 text-primary focus:ring-0 cursor-pointer"
            />
            <span>{eq.nombre}</span>
          </label>
        )
      })}
    </div>
  )
}
