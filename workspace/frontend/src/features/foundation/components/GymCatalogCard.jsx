// Anchored to REQ-FND-005, REQ-FND-014
import { MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function GymCatalogCard({ gimnasios = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <HStack className="gap-2">
          <MapPin className="size-4 text-primary" />
          <CardTitle>Sedes y Equipamiento ({gimnasios.length})</CardTitle>
        </HStack>
        <CardDescription>Máquinas y elementos disponibles por sede</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <VStack className="gap-3">
          {gimnasios.map((gym) => (
            <VStack
              key={gym.id}
              className="gap-1.5 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <HStack justify="between" className="gap-2">
                <span className="text-sm font-semibold">{gym.nombre}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {gym.horario_apertura?.slice(0, 5)} - {gym.horario_cierre?.slice(0, 5)}
                </span>
              </HStack>
              <span className="text-xs text-muted-foreground">{gym.direccion}</span>
              <HStack wrap className="gap-1.5 pt-1">
                {gym.equipamiento_disponible?.map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-[11px]">
                    {item.equipamiento?.nombre}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          ))}
        </VStack>
      </CardContent>
    </Card>
  )
}
