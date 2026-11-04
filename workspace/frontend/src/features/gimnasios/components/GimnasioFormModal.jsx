// Anchored to REQ-GYM-002, REQ-GYM-005, REQ-GYM-006
import { useGimnasioForm } from '../hooks/useGimnasioForm'
import { EquipamientoSelector } from './EquipamientoSelector'
import { GimnasioModalHeader } from './GimnasioModalHeader'
import { GimnasioFormFields } from './GimnasioFormFields'
import { GimnasioModalActions } from './GimnasioModalActions'
import { VStack } from '@/components/ui/VStack'

export function GimnasioFormModal({
  gimnasio,
  equipamientoList,
  onClose,
  onSave,
  onCreateEquipamiento,
}) {
  const form = useGimnasioForm({ gimnasio, onSave, onClose })

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <VStack className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh]">
        <GimnasioModalHeader isEditing={Boolean(gimnasio)} onClose={onClose} />

        {form.errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {form.errorMsg}
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
          <GimnasioFormFields
            nombre={form.nombre}
            setNombre={form.setNombre}
            direccion={form.direccion}
            setDireccion={form.setDireccion}
            horarioApertura={form.horarioApertura}
            setHorarioApertura={form.setHorarioApertura}
            horarioCierre={form.horarioCierre}
            setHorarioCierre={form.setHorarioCierre}
            estado={form.estado}
            setEstado={form.setEstado}
          />

          <EquipamientoSelector
            equipamientoList={equipamientoList}
            selectedEq={form.selectedEq}
            onToggleEq={form.toggleEq}
            onCreateEquipamiento={onCreateEquipamiento}
          />

          <GimnasioModalActions
            onClose={onClose}
            submitting={form.submitting}
            isFormValid={form.isFormValid}
          />
        </form>
      </VStack>
    </div>
  )
}

export default GimnasioFormModal
