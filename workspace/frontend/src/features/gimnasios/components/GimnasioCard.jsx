// Anchored to REQ-GYM-006
import { formatTime } from '../utils/formatTime'
import { GimnasioCardEquipment } from './GimnasioCardEquipment'
import { GimnasioCardActions } from './GimnasioCardActions'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function GimnasioCard({ gimnasio, onEdit, onDelete, onReactivate }) {
  const apertura = formatTime(gimnasio.horario_apertura)
  const cierre = formatTime(gimnasio.horario_cierre)

  return (
    <VStack
      justify="between"
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
    >
      <div>
        <HStack justify="between" align="start" className="gap-3 mb-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{gimnasio.nombre}</h3>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
              gimnasio.estado
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {gimnasio.estado ? 'Activo' : 'Inactivo'}
          </span>
        </HStack>

        <HStack className="text-sm text-slate-400 mb-3 gap-1.5">
          <span>📍</span>
          <span>{gimnasio.direccion || 'Sin dirección registrada'}</span>
        </HStack>

        {(apertura || cierre) && (
          <HStack className="text-xs text-slate-400 mb-4 gap-1.5">
            <span>⏰</span>
            <span>
              {apertura || '08:00'} - {cierre || '22:00'}
            </span>
          </HStack>
        )}

        <GimnasioCardEquipment equipamientos={gimnasio.equipamiento_disponible} />
      </div>

      <GimnasioCardActions
        gimnasio={gimnasio}
        onEdit={onEdit}
        onDelete={onDelete}
        onReactivate={onReactivate}
      />
    </VStack>
  )
}
