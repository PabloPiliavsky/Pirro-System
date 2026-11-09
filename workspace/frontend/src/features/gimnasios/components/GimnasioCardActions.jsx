// Anchored to REQ-GYM-006
import { HStack } from '@/components/ui/HStack'

export function GimnasioCardActions({ gimnasio, onEdit, onDelete, onReactivate }) {
  const isActivo = Boolean(gimnasio.estado)
  const estadoConfig = isActivo
    ? {
        label: 'Dar de baja',
        style: 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20',
        action: () => onDelete(gimnasio.id),
      }
    : {
        label: 'Dar de alta',
        style: 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20',
        action: () => onReactivate?.(gimnasio),
      }

  return (
    <HStack justify="end" className="gap-2 pt-3 border-t border-slate-800/80 mt-2">
      <button
        onClick={() => onEdit(gimnasio)}
        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
      >
        Editar
      </button>
      <button
        onClick={estadoConfig.action}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${estadoConfig.style}`}
      >
        {estadoConfig.label}
      </button>
    </HStack>
  )
}
