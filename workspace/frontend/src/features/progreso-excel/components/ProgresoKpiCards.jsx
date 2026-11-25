// Anchored to REQ-PRG-005, REQ-PRG-012
import { Card, CardContent } from '@/components/ui/card'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { CalendarCheck2, Layers, Trophy, Clock } from 'lucide-react'

export function ProgresoKpiCards({ kpis }) {
  const items = [
    {
      label: 'Sesiones Filtradas',
      value: kpis.totalSesiones,
      icon: CalendarCheck2,
      accent: 'text-primary',
    },
    {
      label: 'Series Ejecutadas',
      value: kpis.totalSeries,
      icon: Layers,
      accent: 'text-primary',
    },
    {
      label: 'Récord de Peso (PR)',
      value: `${kpis.recordPesoKg} kg`,
      icon: Trophy,
      accent: 'text-emerald-400',
    },
    {
      label: 'Última Fecha',
      value: kpis.ultimaFecha || 'Sin registros',
      icon: Clock,
      accent: 'text-foreground',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="border-border bg-card/80">
            <CardContent className="p-3.5">
              <HStack justify="between" align="center" className="gap-2">
                <VStack className="gap-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.label}
                  </span>
                  <span className={`text-lg font-black tabular-nums ${item.accent}`}>
                    {item.value}
                  </span>
                </VStack>
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-4" />
                </div>
              </HStack>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
