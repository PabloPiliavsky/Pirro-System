// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

const HEADER_CONFIG = {
  edit: {
    title: 'Editar Alumno y Ficha',
    desc: 'Actualizá los datos de acceso, contacto y ficha física.',
  },
  create: {
    title: 'Nuevo Alumno',
    desc: 'Creá la cuenta del alumno y configurá su ficha inicial.',
  },
}

export function AlumnoModalHeader({ isEditing, onClose }) {
  const content = isEditing ? HEADER_CONFIG.edit : HEADER_CONFIG.create

  return (
    <HStack justify="between" align="center" className="border-b border-border/40 pb-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {content.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {content.desc}
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
