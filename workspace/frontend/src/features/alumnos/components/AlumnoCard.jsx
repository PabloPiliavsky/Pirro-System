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
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-primary/50 hover:bg-slate-900/90 hover:shadow-xl transition-all duration-200"
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
        className="cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-primary p-2 -m-2 rounded-xl transition-all duration-200 hover:bg-slate-800/40"
        title="Hacé clic para seleccionar y ver la ficha física y médica del alumno"
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
