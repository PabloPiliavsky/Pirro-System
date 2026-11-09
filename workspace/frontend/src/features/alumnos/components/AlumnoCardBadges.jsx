// Anchored to REQ-ALU-007, REQ-ALU-008
import { HStack } from '@/components/ui/HStack'

const BADGE_CONFIG = {
  activo: { label: 'Activo', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  inactivo: { label: 'Inactivo', style: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export function AlumnoCardBadges({ alumno }) {
  const tieneAlertaMedica = Boolean(alumno.salud_enfermedades?.trim())
  const estadoBadge = alumno.estado ? BADGE_CONFIG.activo : BADGE_CONFIG.inactivo

  return (
    <HStack wrap className="gap-1.5 mb-3">
      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border/40">
        📍 {alumno.gimnasio?.nombre || 'Sin sede'}
      </span>
      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border/40">
        ⚡ {alumno.cantidad_dias_rutina || 3} días/sem
      </span>
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${estadoBadge.style}`}>
        {estadoBadge.label}
      </span>
      {tieneAlertaMedica && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
          ⚠️ Ficha Médica
        </span>
      )}
    </HStack>
  )
}
