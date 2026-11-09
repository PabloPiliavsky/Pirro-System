// Anchored to REQ-ALU-002, REQ-ALU-004
import { VStack } from '@/components/ui/VStack'
import { AlumnoFormBasicFields } from './AlumnoFormBasicFields'
import { AlumnoFormAccountFields } from './AlumnoFormAccountFields'

export function AlumnoFormIdentityFields({
  isEditing,
  nombre, setNombre,
  apellido, setApellido,
  email, setEmail,
  nombreUsuario, setNombreUsuario,
  password, setPassword,
  telefono, setTelefono,
}) {
  return (
    <VStack className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
        1. Identidad y Credenciales de Acceso
      </h3>
      <AlumnoFormBasicFields
        nombre={nombre} setNombre={setNombre}
        apellido={apellido} setApellido={setApellido}
        telefono={telefono} setTelefono={setTelefono}
        isEditing={isEditing}
      />
      <AlumnoFormAccountFields
        isEditing={isEditing}
        email={email} setEmail={setEmail}
        nombreUsuario={nombreUsuario} setNombreUsuario={setNombreUsuario}
        password={password} setPassword={setPassword}
      />
    </VStack>
  )
}
