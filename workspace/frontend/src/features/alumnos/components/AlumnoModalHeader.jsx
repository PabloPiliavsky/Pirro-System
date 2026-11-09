// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

export function AlumnoModalHeader({ isEditing, onClose }) {
  return (
    <HStack justify="between" align="center" className="border-b border-border/40 pb-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {isEditing ? 'Editar Alumno y Ficha' : 'Nuevo Alumno'}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isEditing
            ? 'Actualizá los datos de acceso, contacto y ficha física.'
            : 'Creá la cuenta del alumno y configurá su ficha inicial.'}
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
