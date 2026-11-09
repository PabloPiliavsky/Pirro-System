// Anchored to REQ-ALU-009
import { useAlumnoPerfil } from '../hooks/useAlumnoPerfil'
import { AlumnoPerfilHeader } from './AlumnoPerfilHeader'
import { AlumnoPerfilBiometria } from './AlumnoPerfilBiometria'
import { AlumnoPerfilSede } from './AlumnoPerfilSede'
import { AlumnoPerfilProfesor } from './AlumnoPerfilProfesor'
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilPage() {
  const { perfil, loading, error } = useAlumnoPerfil()

  if (loading) {
    return (
      <VStack align="center" justify="center" className="py-20 text-muted-foreground gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm">Cargando tu ficha...</span>
      </VStack>
    )
  }

  if (error || !perfil) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-sm m-4">
        {error || 'No se encontró la ficha del alumno'}
      </div>
    )
  }

  return (
    <VStack className="space-y-4 max-w-lg mx-auto p-4 pb-20">
      <AlumnoPerfilHeader perfil={perfil} />
      <AlumnoPerfilBiometria perfil={perfil} />
      <AlumnoPerfilSede gimnasio={perfil.gimnasio} />
      <AlumnoPerfilProfesor
        profesor={perfil.profesor}
        alumnoNombre={perfil.nombre || perfil.persona?.nombre}
      />
    </VStack>
  )
}

export default AlumnoPerfilPage
