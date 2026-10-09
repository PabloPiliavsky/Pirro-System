// Anchored to REQ-FND-004, REQ-FND-014
import { UserCheck, Building2, CalendarDays } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function RelationalEntityCard({ alumno }) {
  const { persona, usuario, gimnasio } = alumno

  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-4 text-primary" />
              <span>
                {persona?.nombre} {persona?.apellido}
              </span>
            </CardTitle>
            <CardDescription className="font-mono">
              @{usuario?.nombre_usuario} · {usuario?.email}
            </CardDescription>
          </div>
          <Badge variant="accent">{persona?.rol?.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <Building2 className="size-3 text-primary" />
            {gimnasio?.nombre || 'Sin sede'}
          </Badge>
          <Badge variant="secondary">
            <CalendarDays className="size-3 text-primary" />
            {alumno.cantidad_dias_rutina} días/sem
          </Badge>
          <Badge variant="outline" className="font-mono">
            {alumno.altura_cm} cm · {alumno.peso_kg} kg
          </Badge>
        </div>
        <p className="text-muted-foreground">{alumno.salud_enfermedades}</p>
        <div className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
          Cadena 1:1:1 → usuario.id: {usuario?.id} → persona.id: {persona?.id} → perfil_alumno.id_persona:{' '}
          {alumno.id_persona}
        </div>
      </CardContent>
    </Card>
  )
}
