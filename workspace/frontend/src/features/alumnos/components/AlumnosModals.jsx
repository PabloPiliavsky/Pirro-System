// Anchored to REQ-ALU-002, REQ-ALU-003, REQ-ALU-006, REQ-ALU-008
import { AlumnoFormModal } from './AlumnoFormModal'
import { FichaMedicaModal } from './FichaMedicaModal'
import { ConfirmarBajaModal } from './ConfirmarBajaModal'

export function AlumnosModals({
  isCreateOpen,
  editingAlumno,
  viewingFichaAlumno,
  bajaTargetAlumno,
  bajaSubmitting,
  gimnasios,
  onCloseCreate,
  onCloseEdit,
  onCloseFicha,
  onCloseBaja,
  onSaveCreate,
  onSaveEdit,
  onConfirmBaja,
}) {
  return (
    <>
      {isCreateOpen && (
        <AlumnoFormModal
          alumno={null}
          gimnasios={gimnasios}
          onClose={onCloseCreate}
          onSave={onSaveCreate}
        />
      )}

      {editingAlumno && (
        <AlumnoFormModal
          alumno={editingAlumno}
          gimnasios={gimnasios}
          onClose={onCloseEdit}
          onSave={onSaveEdit}
        />
      )}

      {viewingFichaAlumno && (
        <FichaMedicaModal
          alumno={viewingFichaAlumno}
          onClose={onCloseFicha}
        />
      )}

      {bajaTargetAlumno && (
        <ConfirmarBajaModal
          alumno={bajaTargetAlumno}
          onClose={onCloseBaja}
          onConfirm={onConfirmBaja}
          submitting={bajaSubmitting}
        />
      )}
    </>
  )
}

export default AlumnosModals
