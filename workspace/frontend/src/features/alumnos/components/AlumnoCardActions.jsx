// Anchored to REQ-ALU-006, REQ-ALU-007
import { HStack } from '@/components/ui/HStack'
import { AlumnoCardContactActions } from './AlumnoCardContactActions'
import { AlumnoCardManageActions } from './AlumnoCardManageActions'

export function AlumnoCardActions({
  alumno,
  onVerFicha,
  onEdit,
  onSolicitarBaja,
  onReactivar,
}) {
  return (
    <HStack wrap justify="between" align="center" className="pt-3 border-t border-slate-800 gap-2">
      <AlumnoCardContactActions alumno={alumno} onVerFicha={onVerFicha} />
      <AlumnoCardManageActions
        alumno={alumno}
        onEdit={onEdit}
        onSolicitarBaja={onSolicitarBaja}
        onReactivar={onReactivar}
      />
    </HStack>
  )
}
