// Anchored to REQ-AUTH-011
import { Button } from '@/components/ui/button'
import { Dumbbell, Sparkles } from 'lucide-react'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function AlumnoSessionBanner({ user }) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-primary/20 via-card to-card border border-primary/30 p-5 shadow-lg shadow-primary/5">
      <HStack className="gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
        <Sparkles className="size-3.5" />
        <span>Sesión de Hoy</span>
      </HStack>
      <h1 className="text-xl font-black text-foreground tracking-tight">
        ¡A entrenar, {user?.nombre}!
      </h1>
      <p className="text-xs text-muted-foreground mt-1">
        Sede: <strong className="text-foreground">{user?.nombre_gimnasio || 'Iron Temple Palermo'}</strong>
      </p>

      <div className="mt-4">
        <Button
          type="button"
          className="w-full min-h-12 text-sm uppercase tracking-wider font-bold gap-2 shadow-md shadow-primary/25"
        >
          <Dumbbell className="size-5" />
          <span>Iniciar Planilla del Día</span>
        </Button>
      </div>
    </div>
  )
}
