// Anchored to REQ-ALU-002, REQ-ALU-003, REQ-ALU-004, REQ-ALU-005
import { useAlumnoForm } from '../hooks/useAlumnoForm'
import { AlumnoModalHeader } from './AlumnoModalHeader'
import { AlumnoModalError } from './AlumnoModalError'
import { AlumnoFormIdentityFields } from './AlumnoFormIdentityFields'
import { AlumnoFormFitnessFields } from './AlumnoFormFitnessFields'
import { AlumnoFormMedicalFields } from './AlumnoFormMedicalFields'
import { AlumnoModalActions } from './AlumnoModalActions'
import { VStack } from '@/components/ui/VStack'

export function AlumnoFormModal({ alumno, gimnasios = [], onClose, onSave }) {
  const form = useAlumnoForm({ alumno, onSave, onClose })

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <VStack className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[92vh]">
        <AlumnoModalHeader isEditing={form.isEditing} onClose={onClose} />
        <AlumnoModalError message={form.errorMsg} />

        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          <AlumnoFormIdentityFields
            isEditing={form.isEditing}
            nombre={form.nombre} setNombre={form.setNombre}
            apellido={form.apellido} setApellido={form.setApellido}
            email={form.email} setEmail={form.setEmail}
            nombreUsuario={form.nombreUsuario} setNombreUsuario={form.setNombreUsuario}
            password={form.password} setPassword={form.setPassword}
            telefono={form.telefono} setTelefono={form.setTelefono}
          />

          <AlumnoFormFitnessFields
            gimnasios={gimnasios}
            idGimnasio={form.idGimnasio} setIdGimnasio={form.setIdGimnasio}
            cantidadDiasRutina={form.cantidadDiasRutina} setCantidadDiasRutina={form.setCantidadDiasRutina}
            alturaCm={form.alturaCm} setAlturaCm={form.setAlturaCm}
            pesoKg={form.pesoKg} setPesoKg={form.setPesoKg}
            fechaNacimiento={form.fechaNacimiento} setFechaNacimiento={form.setFechaNacimiento}
            fechaIngreso={form.fechaIngreso} setFechaIngreso={form.setFechaIngreso}
            mostrarImc={form.mostrarImc} setMostrarImc={form.setMostrarImc}
          />

          <AlumnoFormMedicalFields
            saludEnfermedades={form.saludEnfermedades} setSaludEnfermedades={form.setSaludEnfermedades}
            comentario={form.comentario} setComentario={form.setComentario}
          />

          <AlumnoModalActions
            onClose={onClose}
            submitting={form.submitting}
            isFormValid={form.isFormValid}
            isEditing={form.isEditing}
          />
        </form>
      </VStack>
    </div>
  )
}

export default AlumnoFormModal
