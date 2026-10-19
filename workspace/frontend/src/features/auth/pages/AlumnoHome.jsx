// Anchored to REQ-AUTH-011
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, CalendarDays, Flame, Sparkles } from 'lucide-react'

export function AlumnoHome() {
  const { user } = useAuth()

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-linear-to-br from-primary/20 via-card to-card border border-primary/30 p-5 shadow-lg shadow-primary/5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          <Sparkles className="size-3.5" />
          <span>Sesión de Hoy</span>
        </div>
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

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border bg-card/80">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px] flex items-center gap-1">
              <CalendarDays className="size-3 text-primary" /> Frecuencia
            </CardDescription>
            <CardTitle className="text-sm font-bold">3 Días / Semana</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
            Rutina personalizada
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px] flex items-center gap-1">
              <Flame className="size-3 text-primary" /> Historial
            </CardDescription>
            <CardTitle className="text-sm font-bold">Último Registro</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
            Ayer (Series completadas)
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AlumnoHome
