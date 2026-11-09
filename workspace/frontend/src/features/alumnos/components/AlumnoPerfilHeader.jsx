// Anchored to REQ-ALU-009
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilHeader({ perfil }) {
  const nombre = perfil?.nombre || perfil?.persona?.nombre || 'Alumno'
  const apellido = perfil?.apellido || perfil?.persona?.apellido || ''
  const usuario = perfil?.nombre_usuario || perfil?.usuario?.nombre_usuario || 'usuario'
  const email = perfil?.email || perfil?.usuario?.email || 'Sin correo'
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <HStack align="center" className="gap-4">
        <div className="size-16 rounded-full bg-primary/15 border-2 border-primary/40 text-primary font-black flex items-center justify-center text-xl shadow-inner shrink-0">
          {iniciales}
        </div>
        <VStack className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-foreground truncate">
            {nombre} {apellido}
          </h1>
          <span className="text-xs text-muted-foreground font-mono">
            @{usuario}
          </span>
          <span className="text-xs text-muted-foreground truncate mt-0.5">
            ✉️ {email}
          </span>
        </VStack>
      </HStack>
    </div>
  )
}
