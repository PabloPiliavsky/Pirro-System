// Anchored to REQ-ALU-006
import { HStack } from '@/components/ui/HStack'

export function ConfirmarBajaHeader({ nombreCompleto, nombreUsuario }) {
  return (
    <HStack align="center" className="gap-3">
      <div className="size-10 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center text-lg shrink-0">
        ⚠️
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">
          Confirmar Baja de Alumno
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {nombreCompleto} (@{nombreUsuario})
        </p>
      </div>
    </HStack>
  )
}
