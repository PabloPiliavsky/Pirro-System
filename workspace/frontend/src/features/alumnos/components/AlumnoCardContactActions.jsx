// Anchored to REQ-ALU-007, REQ-ALU-008
import { formatearWhatsAppLink } from '../utils/alumnoFormatters'
import { HStack } from '@/components/ui/HStack'

export function AlumnoCardContactActions({ alumno, onVerFicha }) {
  const whatsappUrl = formatearWhatsAppLink(alumno.telefono, alumno.nombre)

  return (
    <HStack wrap align="center" className="gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onVerFicha(alumno)
        }}
        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
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
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
          title="Contactar por WhatsApp"
        >
          💬 WhatsApp
        </a>
      )}
    </HStack>
  )
}
