// Anchored to REQ-EJE-002
import { HStack } from '@/components/ui/HStack'

export function EjercicioModalHeader({ isEditing, onClose }) {
  return (
    <HStack justify="between" className="pb-4 border-b border-slate-800">
      <h2 className="text-xl font-bold text-white">
        {isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
      </h2>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
      >
        ✕
      </button>
    </HStack>
  )
}
