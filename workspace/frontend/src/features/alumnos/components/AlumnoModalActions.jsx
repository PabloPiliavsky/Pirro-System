// Anchored to REQ-ALU-002, REQ-ALU-003
import { HStack } from '@/components/ui/HStack'

export function AlumnoModalActions({ onClose, submitting, isFormValid, isEditing }) {
  let submitLabel = isEditing ? 'Actualizar Alumno' : 'Guardar Alumno'
  if (submitting) submitLabel = 'Guardando...'

  return (
    <HStack justify="end" align="center" className="gap-3 pt-4 border-t border-border/40">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer active:scale-95 disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={!isFormValid || submitting}
        className="px-5 py-2 text-sm font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </HStack>
  )
}
