// Anchored to REQ-TRN-001, REQ-TRN-003, REQ-TRN-010, REQ-TRN-012
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { SerieCellButton } from './SerieCellButton'
import { FileText } from 'lucide-react'

export function EjercicioCard({ item, draftSeries, onOpenModal }) {
  const seriesIndices = Array.from({ length: item.series_objetivo }, (_, i) => i + 1)

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-4 pb-2">
        <HStack justify="between" align="start" className="gap-2">
          <HStack align="center" className="gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
              #{item.orden}
            </span>
            <CardTitle className="text-sm font-bold text-foreground">
              {item.ejercicio?.nombre || 'Ejercicio'}
            </CardTitle>
          </HStack>
          <Badge variant="outline" className="text-[10px] uppercase font-semibold">
            {item.ejercicio?.grupo_muscular || 'General'}
          </Badge>
        </HStack>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <VStack className="gap-3">
          {item.notas_profesor && (
            <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50">
              <HStack align="start" className="gap-1.5">
                <FileText className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">{item.notas_profesor}</span>
              </HStack>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {seriesIndices.map((num) => {
              const completed = draftSeries.find(
                (s) =>
                  Number(s.idEjercicio) === Number(item.id_ejercicio) &&
                  Number(s.numeroSerie) === Number(num)
              )
              return (
                <SerieCellButton
                  key={num}
                  numeroSerie={num}
                  repeticionesObjetivo={item.repeticiones_objetivo}
                  completedSerie={completed}
                  onSelect={(serieNum) => onOpenModal(item, serieNum)}
                />
              )
            })}
          </div>
        </VStack>
      </CardContent>
    </Card>
  )
}
