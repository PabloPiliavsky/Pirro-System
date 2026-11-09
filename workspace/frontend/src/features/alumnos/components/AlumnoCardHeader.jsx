// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { getInitials } from '../utils/getInitials'

export function AlumnoCardHeader({ alumno }) {
  const initials = getInitials(alumno.nombre, alumno.apellido)

  return (
    <HStack align="center" className="gap-3 mb-3">
      <div className="size-12 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold flex items-center justify-center text-sm shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-200">
        {initials}
      </div>
      <VStack className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-foreground truncate tracking-wide group-hover:text-primary transition-colors duration-200">
          {alumno.nombre_completo}
        </h3>
        <span className="text-xs text-muted-foreground truncate font-mono">
          @{alumno.nombre_usuario || 'sin_usuario'}
        </span>
      </VStack>
    </HStack>
  )
}
