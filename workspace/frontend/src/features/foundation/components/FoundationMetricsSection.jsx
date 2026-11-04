// Anchored to REQ-FND-003, REQ-FND-014
import { Card, CardContent } from '@/components/ui/card'
import { VStack } from '@/components/ui/VStack'

export function FoundationMetricsSection({ counts = {}, summary }) {
  const metrics = [
    {
      label: 'Alumnos en Cartera (Personas)',
      value: counts.alumnos || 0,
      helper: `${summary?.profesor?.nombre || ''} ${summary?.profesor?.apellido || ''} (Profesor activo)`.trim(),
    },
    {
      label: 'Sedes y Ejercicios Disponibles',
      value: `${counts.gimnasios || 0} sedes · ${counts.ejercicios || 0} ejercicios`,
      helper: 'Catálogo con requerimiento de máquina',
    },
    {
      label: 'Sesiones Guardadas en Historial',
      value: `${counts.registros_rutina || 0} sesión (${counts.detalle_series || 0} series)`,
      helper: 'Semilla: 06/10/2026 de Martín Gómez',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-0">
            <VStack className="gap-1 p-4">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="font-mono text-xl font-bold text-primary">{metric.value}</span>
              <span className="text-[11px] text-muted-foreground/80">{metric.helper}</span>
            </VStack>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
