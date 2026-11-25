// Anchored to REQ-PRG-006, REQ-PRG-012
// COMPONENTE DE VISTA 1 (INDEPENDIENTE): Vista agrupada por Tarjetas de Sesión
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { CalendarDays, Dumbbell, MessageSquare } from 'lucide-react'

function groupSeriesByEjercicio(series) {
  const groups = new Map()
  for (const s of series || []) {
    const key = s.id_ejercicio
    if (!groups.has(key)) {
      groups.set(key, {
        id_ejercicio: key,
        nombre: s.ejercicio?.nombre || `Ejercicio #${key}`,
        grupo_muscular: s.ejercicio?.grupo_muscular || '',
        repeticiones_objetivo: s.repeticiones_objetivo || '',
        series: [],
      })
    }
    groups.get(key).series.push(s)
  }
  return Array.from(groups.values())
}

export function ProgresoSesionesView({ sesionesFiltradas }) {
  return (
    <VStack className="gap-3" data-testid="progreso-sesiones-view">
      {sesionesFiltradas.map((sesion) => {
        const ejerciciosAgrupados = groupSeriesByEjercicio(sesion.series)
        const tituloRutina = sesion.rutina
          ? `Día ${sesion.rutina.numero_dia} — ${sesion.rutina.nombre_rutina}`
          : `Rutina #${sesion.id_rutina}`

        return (
          <Card key={sesion.id} className="border-border bg-card/85">
            <CardContent className="p-4">
              <VStack className="gap-3">
                <HStack justify="between" align="center" className="border-b border-border/70 pb-2.5 flex-wrap gap-2">
                  <HStack align="center" className="gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <CalendarDays className="size-4" />
                    </div>
                    <VStack className="gap-0">
                      <span className="text-xs font-bold text-primary tabular-nums">
                        {sesion.fecha_realizacion}
                      </span>
                      <h3 className="text-sm font-black text-foreground">{tituloRutina}</h3>
                    </VStack>
                  </HStack>

                  <Badge variant="secondary" className="font-bold">
                    {sesion.series.length} series registradas
                  </Badge>
                </HStack>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ejerciciosAgrupados.map((grupo) => {
                    const comentarios = grupo.series
                      .filter((s) => Boolean(s.comentario_alumno))
                      .map((s) => `S${s.numero_serie}: "${s.comentario_alumno}"`)

                    return (
                      <div
                        key={grupo.id_ejercicio}
                        className="rounded-xl border border-border bg-background/60 p-3 space-y-2"
                      >
                        <HStack justify="between" align="center" className="gap-2">
                          <HStack align="center" className="gap-1.5">
                            <Dumbbell className="size-3.5 text-primary" />
                            <span className="text-xs font-bold text-foreground">
                              {grupo.nombre}
                            </span>
                          </HStack>
                          <span className="text-xs text-muted-foreground">
                            Obj: {grupo.repeticiones_objetivo}
                          </span>
                        </HStack>

                        <HStack className="flex-wrap gap-1.5">
                          {grupo.series.map((ser) => (
                            <span
                              key={ser.id || ser.numero_serie}
                              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-mono font-bold text-emerald-400"
                            >
                              S{ser.numero_serie}: {ser.repeticiones_realizadas}r × {ser.peso_utilizado}kg
                            </span>
                          ))}
                        </HStack>

                        {comentarios.length > 0 && (
                          <HStack align="center" className="gap-1.5 text-xs text-muted-foreground italic pt-0.5">
                            <MessageSquare className="size-3 shrink-0 text-primary" />
                            <span>{comentarios.join(' · ')}</span>
                          </HStack>
                        )}
                      </div>
                    )
                  })}
                </div>
              </VStack>
            </CardContent>
          </Card>
        )
      })}
    </VStack>
  )
}
