// Anchored to REQ-ALU-007, REQ-ALU-008
import { formatearWhatsAppLink } from '../utils/alumnoFormatters'
import { HStack } from '@/components/ui/HStack'

export function AlumnoCardContactActions({ alumno, onVerFicha }) {
  const whatsappUrl = formatearWhatsAppLink(alumno.telefono, alumno.nombre)

  return (
    <HStack align="center" className="gap-1.5">
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
    </HStack>
  )
}
