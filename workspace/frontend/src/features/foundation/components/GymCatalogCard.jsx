// Anchored to REQ-FND-005, REQ-FND-014
import { MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function GymCatalogCard({ gimnasios = [] }) {
  return (
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
  )
}
