// Anchored to REQ-ALU-006, REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

const ESTADO_CONFIG = {
  activo: {
    label: 'Baja',
    title: 'Dar de baja',
    style: 'text-red-400 hover:bg-red-500/15 border border-red-500/20',
  },
  inactivo: {
    label: 'Activar',
    title: 'Reactivar',
    style: 'text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/20',
  },
}

export function AlumnoCardManageActions({ alumno, onEdit, onSolicitarBaja, onReactivar }) {
  const isActivo = Boolean(alumno.estado)
  const estadoConfig = isActivo ? ESTADO_CONFIG.activo : ESTADO_CONFIG.inactivo

  const handleEstadoClick = (e) => {
    e.stopPropagation()
    if (isActivo) {
      onSolicitarBaja(alumno)
      return
    }
    onReactivar(alumno.id_persona)
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
        className={`px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer active:scale-95 ${estadoConfig.style}`}
        title={estadoConfig.title}
      >
        {estadoConfig.label}
      </button>
    </HStack>
  )
}
