// Anchored to REQ-ALU-007
import { AlumnoCardHeader } from './AlumnoCardHeader'
import { AlumnoCardBadges } from './AlumnoCardBadges'
import { AlumnoCardMetrics } from './AlumnoCardMetrics'
import { AlumnoCardActions } from './AlumnoCardActions'
import { VStack } from '@/components/ui/VStack'

export function AlumnoCard({
  alumno,
  onVerFicha,
  onEdit,
  onSolicitarBaja,
  onReactivar,
}) {
  return (
    <VStack
      justify="between"
      className="bg-card border border-border/60 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div
        onClick={() => onVerFicha(alumno)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onVerFicha(alumno)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver ficha médica de ${alumno.nombre_completo}`}
        className="cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-primary rounded-lg transition"
        title="Hacé clic en esta tarjeta para abrir su ficha física y médica"
      >
        <AlumnoCardHeader alumno={alumno} />
        <AlumnoCardBadges alumno={alumno} />
        <AlumnoCardMetrics alumno={alumno} />
      </div>

      <AlumnoCardActions
        alumno={alumno}
        onVerFicha={onVerFicha}
        onEdit={onEdit}
        onSolicitarBaja={onSolicitarBaja}
        onReactivar={onReactivar}
      />
    </VStack>
  )
}
