// Anchored to REQ-TRN-001, REQ-TRN-010, REQ-TRN-012
import { Card, CardContent } from '@/components/ui/card'
import { VStack } from '@/components/ui/VStack'
import { Dumbbell } from 'lucide-react'

export function PlanillaVaciaCard() {
  return (
    <Card className="border-border bg-card/60 text-center p-6">
      <CardContent className="p-0">
        <VStack align="center" className="gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Dumbbell className="size-6" />
          </div>
          <VStack align="center" className="gap-1">
            <span className="text-sm font-bold text-foreground">
              Sin rutinas programadas
            </span>
            <span className="text-xs text-muted-foreground max-w-xs">
              Tu profesor Leandro Pirro aún no asignó ejercicios para tus días de entrenamiento.
            </span>
          </VStack>
        </VStack>
      </CardContent>
    </Card>
  )
}
