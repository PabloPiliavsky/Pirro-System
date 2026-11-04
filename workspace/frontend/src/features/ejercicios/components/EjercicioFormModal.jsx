// Anchored to REQ-EJE-002, REQ-EJE-003, REQ-EJE-006
import { useEjercicioForm } from '../hooks/useEjercicioForm'
import { MuscleGroupMultiSelect } from './MuscleGroupMultiSelect'
import { EjercicioModalHeader } from './EjercicioModalHeader'
import { EjercicioEquipmentFields } from './EjercicioEquipmentFields'
import { EjercicioNotesFields } from './EjercicioNotesFields'
import { EjercicioModalActions } from './EjercicioModalActions'
import { VStack } from '@/components/ui/VStack'

export function EjercicioFormModal({ ejercicio, equipamientoList, onClose, onSave }) {
  const form = useEjercicioForm({ ejercicio, onSave, onClose })

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <VStack className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh]">
        <EjercicioModalHeader isEditing={Boolean(ejercicio)} onClose={onClose} />

        {form.errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {form.errorMsg}
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
          <p className="text-[11px] text-slate-400">
            Los campos marcados con <span className="text-red-400 font-bold">*</span> son obligatorios.
          </p>

          <VStack>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nombre del ejercicio <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => form.setNombre(e.target.value)}
              placeholder="Ej: Press de Banca Plano"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              required
            />
          </VStack>

          <MuscleGroupMultiSelect
            selectedMuscles={form.selectedMuscles}
            onToggleMuscle={form.toggleMuscle}
          />

          <EjercicioEquipmentFields
            requiereEq={form.requiereEq}
            setRequiereEq={form.setRequiereEq}
            idEqRequerido={form.idEqRequerido}
            setIdEqRequerido={form.setIdEqRequerido}
            equipamientoList={equipamientoList}
          />

          <EjercicioNotesFields
            indicaciones={form.indicaciones}
            setIndicaciones={form.setIndicaciones}
            urlVideo={form.urlVideo}
            setUrlVideo={form.setUrlVideo}
            estado={form.estado}
            setEstado={form.setEstado}
          />

          <EjercicioModalActions
            onClose={onClose}
            submitting={form.submitting}
            isFormValid={form.isFormValid}
          />
        </form>
      </VStack>
    </div>
  )
}
