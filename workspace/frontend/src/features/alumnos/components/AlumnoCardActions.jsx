// Anchored to REQ-ALU-006, REQ-ALU-007
import { formatearWhatsAppLink } from '../utils/alumnoFormatters'
import { HStack } from '@/components/ui/HStack'

export function AlumnoCardActions({
  alumno,
  onVerFicha,
  onEdit,
  onSolicitarBaja,
  onReactivar,
}) {
  const whatsappUrl = formatearWhatsAppLink(alumno.telefono, alumno.nombre)

  const handleEstadoClick = (e) => {
    e.stopPropagation()
    if (alumno.estado) {
      onSolicitarBaja(alumno)
    } else {
      onReactivar(alumno.id_persona)
    }
  }

  return (
    <HStack justify="between" align="center" className="pt-3 border-t border-border/40 gap-2">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onVerFicha(alumno)
          }}
          className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer active:scale-95 shadow-xs"
          title="Ver Ficha Médica y Física"
        >
          📋 Ficha
        </button>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
            title="Contactar por WhatsApp"
          >
            💬 WhatsApp
          </a>
        )}
      </div>

      <div className="flex items-center gap-1.5">
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
      </div>
    </HStack>
  )
}
