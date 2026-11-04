// Anchored to REQ-FND-004, REQ-FND-014
import { UserCheck, Building2, CalendarDays } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function RelationalEntityCard({ alumno }) {
  const { persona, usuario, gimnasio } = alumno

  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardHeader className="pb-3">
        <HStack justify="between" align="start" className="gap-2">
          <VStack className="gap-1">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-4 text-primary" />
              <span>
                {persona?.nombre} {persona?.apellido}
              </span>
            </CardTitle>
            <CardDescription className="font-mono">
              @{usuario?.nombre_usuario} · {usuario?.email}
            </CardDescription>
          </VStack>
          <Badge variant="accent">{persona?.rol?.toUpperCase()}</Badge>
        </HStack>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <VStack className="gap-3 text-xs">
          <HStack wrap className="gap-2">
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
          </HStack>
          <p className="text-muted-foreground">{alumno.salud_enfermedades}</p>
          <div className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
            Cadena 1:1:1 → usuario.id: {usuario?.id} → persona.id: {persona?.id} → perfil_alumno.id_persona:{' '}
            {alumno.id_persona}
          </div>
        </VStack>
      </CardContent>
    </Card>
  )
}
