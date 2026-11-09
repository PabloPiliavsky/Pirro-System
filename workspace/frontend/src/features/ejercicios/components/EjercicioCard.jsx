// Anchored to REQ-EJE-006
import { EjercicioCardTags } from './EjercicioCardTags'
import { EjercicioCardActions } from './EjercicioCardActions'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

const ESTADO_CONFIG = {
  activo: { label: 'Activo', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  inactivo: { label: 'Inactivo', style: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export function EjercicioCard({ ejercicio, onEdit, onDelete }) {
  const estadoBadge = ejercicio.estado ? ESTADO_CONFIG.activo : ESTADO_CONFIG.inactivo

  return (
    <VStack
      justify="between"
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
    >
      <div>
        <HStack justify="between" align="start" className="gap-3 mb-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{ejercicio.nombre}</h3>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${estadoBadge.style}`}>
            {estadoBadge.label}
          </span>
        </HStack>

        <EjercicioCardTags ejercicio={ejercicio} />

        {ejercicio.indicaciones && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {ejercicio.indicaciones}
          </p>
        )}

        {ejercicio.url_video && (
          <a
            href={ejercicio.url_video}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition mb-3 font-medium"
          >
            <span>▶</span> Ver demostración
          </a>
        )}
      </div>

      <EjercicioCardActions
        ejercicio={ejercicio}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </VStack>
  )
}
