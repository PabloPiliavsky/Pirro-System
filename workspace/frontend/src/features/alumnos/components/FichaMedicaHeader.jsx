// Anchored to REQ-ALU-008
import { HStack } from '@/components/ui/HStack'

export function FichaMedicaHeader({ alumno, onClose }) {
  return (
    <HStack justify="between" align="start" className="border-b border-border/40 pb-4">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-wide">
          Ficha Física y Médica
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {alumno.nombre_completo} (@{alumno.nombre_usuario})
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground text-xl p-1 rounded-md cursor-pointer active:scale-90 transition-all"
        aria-label="Cerrar modal"
      >
        ✕
      </button>
    </HStack>
  )
}
