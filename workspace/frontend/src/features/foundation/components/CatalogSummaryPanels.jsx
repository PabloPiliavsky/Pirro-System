// Anchored to REQ-FND-005, REQ-FND-006, REQ-FND-014
import { Dumbbell, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CatalogSummaryPanels({ gimnasios = [], ejercicios = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <span>Sedes y Equipamiento ({gimnasios.length})</span>
          </CardTitle>
          <CardDescription>Máquinas y elementos disponibles por sede</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {gimnasios.map((gym) => (
            <div key={gym.id} className="flex flex-col gap-1.5 rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{gym.nombre}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {gym.horario_apertura?.slice(0, 5)} - {gym.horario_cierre?.slice(0, 5)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{gym.direccion}</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {gym.equipamiento_disponible?.map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-[11px]">
                    {item.equipamiento?.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
    </div>
  )
}
