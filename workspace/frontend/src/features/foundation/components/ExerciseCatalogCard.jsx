// Anchored to REQ-FND-006, REQ-FND-014
import { Dumbbell } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ExerciseCatalogCard({ ejercicios = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="size-4 text-primary" />
          <span>Catálogo de Ejercicios ({ejercicios.length})</span>
        </CardTitle>
        <CardDescription>Ejercicios con indicador de requerimiento de máquina</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {ejercicios.map((ej) => (
          <div
            key={ej.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-foreground">{ej.nombre}</span>
              <span className="text-muted-foreground">{ej.grupo_muscular}</span>
            </div>
            <Badge variant={ej.requiere_equipamiento ? 'accent' : 'outline'}>
              {ej.requiere_equipamiento ? 'Requiere Máquina' : 'Peso Físico'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
