// Anchored to REQ-ALU-007, REQ-ALU-008
import { HStack } from '@/components/ui/HStack'

export function AlumnoCardBadges({ alumno }) {
  const tieneAlertaMedica = Boolean(alumno.salud_enfermedades?.trim())

  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border/40">
        📍 {alumno.gimnasio?.nombre || 'Sin sede'}
      </span>
      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border/40">
        ⚡ {alumno.cantidad_dias_rutina || 3} días/sem
      </span>
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
          alumno.estado
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}
      >
        {alumno.estado ? 'Activo' : 'Inactivo'}
      </span>
      {tieneAlertaMedica && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
          ⚠️ Ficha Médica
        </span>
      )}
    </div>
  )
}
