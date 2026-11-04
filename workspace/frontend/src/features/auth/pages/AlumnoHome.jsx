// Anchored to REQ-AUTH-011
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlumnoSessionBanner } from '../components/AlumnoSessionBanner'
import { CalendarDays, Flame } from 'lucide-react'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function AlumnoHome() {
  const { user } = useAuth()

  return (
    <VStack className="gap-5">
      <AlumnoSessionBanner user={user} />

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border bg-card/80">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">
              <HStack className="gap-1">
                <CalendarDays className="size-3 text-primary" />
                <span>Frecuencia</span>
              </HStack>
            </CardDescription>
            <CardTitle className="text-sm font-bold">3 Días / Semana</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
            Rutina personalizada
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader className="p-3 pb-1">
            <CardDescription className="text-[11px]">
              <HStack className="gap-1">
                <Flame className="size-3 text-primary" />
                <span>Historial</span>
              </HStack>
            </CardDescription>
            <CardTitle className="text-sm font-bold">Último Registro</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
            Ayer (Series completadas)
          </CardContent>
        </Card>
      </div>
    </VStack>
  )
}

export default AlumnoHome
