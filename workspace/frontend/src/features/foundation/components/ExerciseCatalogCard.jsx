// Anchored to REQ-FND-006, REQ-FND-014
import { Dumbbell } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function ExerciseCatalogCard({ ejercicios = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <HStack className="gap-2">
          <Dumbbell className="size-4 text-primary" />
          <CardTitle>Catálogo de Ejercicios ({ejercicios.length})</CardTitle>
        </HStack>
        <CardDescription>Ejercicios con indicador de requerimiento de máquina</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <VStack className="gap-2">
          {ejercicios.map((ej) => (
            <HStack
              key={ej.id}
              justify="between"
              className="gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs"
            >
              <VStack className="gap-0.5">
                <span className="font-semibold text-foreground">{ej.nombre}</span>
                <span className="text-muted-foreground">{ej.grupo_muscular}</span>
              </VStack>
              <Badge variant={ej.requiere_equipamiento ? 'accent' : 'outline'}>
                {ej.requiere_equipamiento ? 'Requiere Máquina' : 'Peso Físico'}
              </Badge>
            </HStack>
          ))}
        </VStack>
      </CardContent>
    </Card>
  )
}
