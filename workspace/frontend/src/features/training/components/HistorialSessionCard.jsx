// Anchored to REQ-TRN-009, REQ-TRN-010, REQ-TRN-012
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { Calendar, ChevronDown, ChevronUp, Dumbbell, MessageSquare } from 'lucide-react'

export function HistorialSessionCard({ session }) {
  const [expanded, setExpanded] = useState(false)
  const series = session.series || []

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <CardHeader
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer select-none hover:bg-muted/20 transition-colors"
      >
        <HStack justify="between" align="center">
          <VStack className="gap-1">
            <HStack align="center" className="gap-2">
              <Calendar className="size-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">
                {session.fecha_realizacion}
              </span>
            </HStack>
            <CardTitle className="text-sm font-bold text-foreground">
              {session.rutina?.nombre_rutina || `Día ${session.rutina?.numero_dia || 1}`}
            </CardTitle>
          </VStack>

          <HStack align="center" className="gap-2">
            <Badge variant="outline" className="text-xs font-semibold">
              {series.length} series
            </Badge>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </HStack>
        </HStack>
      </CardHeader>

      {expanded && (
        <CardContent className="p-4 pt-0 border-t border-border/40">
          <VStack className="gap-2.5 pt-3">
            {series.map((s) => (
              <div
                key={s.id || `${s.id_ejercicio}-${s.numero_serie}`}
                className="rounded-lg bg-muted/30 p-2.5 text-xs border border-border/40"
              >
                <HStack justify="between" align="center">
                  <HStack align="center" className="gap-2">
                    <Dumbbell className="size-3.5 text-primary" />
                    <span className="font-bold text-foreground">
                      {s.ejercicio?.nombre || 'Ejercicio'}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      (S{s.numero_serie})
                    </span>
                  </HStack>
                  <span className="font-bold text-primary">
                    {s.repeticiones_realizadas} reps · {s.peso_utilizado} kg
                  </span>
                </HStack>
                {s.comentario_alumno && (
                  <HStack align="center" className="gap-1.5 mt-1.5 text-muted-foreground text-[11px]">
                    <MessageSquare className="size-3 text-muted-foreground" />
                    <span className="italic">{s.comentario_alumno}</span>
                  </HStack>
                )}
              </div>
            ))}
          </VStack>
        </CardContent>
      )}
    </Card>
  )
}
