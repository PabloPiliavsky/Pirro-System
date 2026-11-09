// Anchored to REQ-ALU-009
import { formatearWhatsAppLink } from '../utils/alumnoFormatters'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilProfesor({ profesor, alumnoNombre }) {
  const whatsappUrl = formatearWhatsAppLink(profesor?.telefono, alumnoNombre)

  return (
    <VStack className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Tu Profesor
      </h2>
      <HStack justify="between" align="center" className="gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {profesor?.nombre_completo || 'Leandro Pirro'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            ✉️ {profesor?.email || 'leandro@pirrosystem.com'}
          </p>
        </div>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>💬</span>
            <span>Consultar por WhatsApp</span>
          </a>
        )}
      </HStack>
    </VStack>
  )
}
