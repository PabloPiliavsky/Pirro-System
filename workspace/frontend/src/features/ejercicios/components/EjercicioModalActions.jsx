// Anchored to REQ-EJE-002
import { HStack } from '@/components/ui/HStack'

export function EjercicioModalActions({ onClose, submitting, isFormValid }) {
  return (
    <HStack justify="end" className="gap-3 pt-4 border-t border-slate-800">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={submitting || !isFormValid}
        className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition cursor-pointer shadow-md shadow-primary/20"
      >
        {submitting ? 'Guardando...' : 'Guardar Ejercicio'}
      </button>
    </HStack>
  )
}
