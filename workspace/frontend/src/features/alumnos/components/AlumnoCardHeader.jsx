// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { getInitials } from '../utils/getInitials'

export function AlumnoCardHeader({ alumno }) {
  const initials = getInitials(alumno.nombre, alumno.apellido)

  return (
    <HStack align="center" className="gap-3 mb-3">
      <div className="size-12 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold flex items-center justify-center text-sm shadow-inner shrink-0 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary/25 transition-all duration-200">
        {initials}
      </div>
      <VStack className="min-w-0 flex-1">
        <HStack justify="between" align="center">
          <h3 className="text-base font-bold text-white truncate tracking-wide group-hover:text-primary transition-colors duration-200">
            {alumno.nombre_completo}
          </h3>
          <span className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-primary transition-opacity duration-200 shrink-0">
            Ficha ↗
          </span>
        </HStack>
        <span className="text-xs text-slate-400 truncate font-mono">
          @{alumno.nombre_usuario}
        </span>
      </VStack>
    </HStack>
  )
}
