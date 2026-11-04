// Anchored to REQ-GYM-005
import { HStack } from '@/components/ui/HStack'

export function NewEquipamientoInlineForm({
  newEqName,
  onNameChange,
  onCreate,
  creatingEq,
}) {
  return (
    <HStack className="p-3 mb-2 bg-slate-950/80 border border-slate-800 rounded-lg gap-2">
      <input
        type="text"
        value={newEqName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nombre de la nueva máquina o accesorio..."
        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={onCreate}
        disabled={!newEqName.trim() || creatingEq}
        className="px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
      >
        {creatingEq ? 'Guardando...' : 'Crear'}
      </button>
    </HStack>
  )
}
