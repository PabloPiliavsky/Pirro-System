// Anchored to REQ-ALU-006, REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

export function AlumnoCardManageActions({ alumno, onEdit, onSolicitarBaja, onReactivar }) {
  const handleEstadoClick = (e) => {
    e.stopPropagation()
    if (alumno.estado) {
      onSolicitarBaja(alumno)
    } else {
      onReactivar(alumno.id_persona)
    }
  }

  return (
    <HStack align="center" className="gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(alumno)
        }}
        className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer active:scale-95 shadow-xs"
        title="Editar Alumno"
      >
        ✏️ Editar
      </button>
      <button
        type="button"
        onClick={handleEstadoClick}
        className={`px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer active:scale-95 ${
          alumno.estado
            ? 'text-red-400 hover:bg-red-500/15 border border-red-500/20'
            : 'text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/20'
        }`}
        title={alumno.estado ? 'Dar de baja' : 'Reactivar'}
      >
        {alumno.estado ? 'Baja' : 'Activar'}
      </button>
    </HStack>
  )
}
