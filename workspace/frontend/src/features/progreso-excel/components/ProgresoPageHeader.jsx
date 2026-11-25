// Anchored to REQ-PRG-001, REQ-PRG-007, REQ-PRG-009, REQ-PRG-012
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { TrendingUp, FileSpreadsheet, CalendarX2 } from 'lucide-react'

export function ProgresoPageHeader({ canExport, onOpenExport }) {
  return (
    <HStack justify="between" align="center" className="flex-wrap gap-3">
      <HStack align="center" className="gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <TrendingUp className="size-5" />
        </div>
        <VStack className="gap-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Seguimiento & Reportes
          </span>
          <h1 className="text-xl font-black text-foreground">
            Progreso de Cargas y Exportación Excel
          </h1>
        </VStack>
      </HStack>

      <Button
        type="button"
        onClick={onOpenExport}
        disabled={!canExport}
        className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
      >
        <FileSpreadsheet className="size-4" />
        Exportar Excel (.xlsx)
      </Button>
    </HStack>
  )
}

export function ProgresoEmptyState() {
  return (
    <Card className="border-border bg-card/60 p-8 text-center">
      <CardContent className="p-0">
        <VStack align="center" className="gap-2">
          <CalendarX2 className="size-8 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">
            No se encontraron entrenamientos para los filtros aplicados
          </span>
          <span className="text-xs text-muted-foreground">
            Probá ampliar el rango de fechas (o limpiar filtros) y presionar &ldquo;Aplicar Filtros&rdquo;.
          </span>
        </VStack>
      </CardContent>
    </Card>
  )
}
