// Anchored to REQ-PRG-006, REQ-PRG-012
// COMPONENTE DE VISTA 2 (INDEPENDIENTE): Vista de Tabla Plana de Series
import { Card, CardContent } from '@/components/ui/card'

export function ProgresoTablaSeriesView({ seriesPlanas }) {
  return (
    <Card className="border-border bg-card/85 overflow-hidden" data-testid="progreso-tabla-view">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-bold">Fecha</th>
                <th className="py-2.5 px-3 font-bold">Rutina</th>
                <th className="py-2.5 px-3 font-bold">Ejercicio</th>
                <th className="py-2.5 px-2.5 font-bold">N° Serie</th>
                <th className="py-2.5 px-2.5 font-bold">Reps Obj</th>
                <th className="py-2.5 px-2.5 font-bold">Reps Realizadas</th>
                <th className="py-2.5 px-2.5 font-bold">Peso (kg)</th>
                <th className="py-2.5 px-3 font-bold">Comentario Alumno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {seriesPlanas.map((row) => (
                <tr key={row.key} className="hover:bg-muted/20 transition">
                  <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">
                    {row.fecha_realizacion}
                  </td>
                  <td className="py-2 px-3 text-foreground">{row.nombre_rutina}</td>
                  <td className="py-2 px-3 font-bold text-foreground">{row.nombre_ejercicio}</td>
                  <td className="py-2 px-2.5 font-mono font-bold text-muted-foreground">
                    #{row.numero_serie}
                  </td>
                  <td className="py-2 px-2.5 font-mono text-muted-foreground">
                    {row.repeticiones_objetivo}
                  </td>
                  <td className="py-2 px-2.5 font-mono font-bold text-foreground">
                    {row.repeticiones_realizadas}
                  </td>
                  <td className="py-2 px-2.5 font-mono font-black text-emerald-400">
                    {row.peso_utilizado} kg
                  </td>
                  <td className="py-2 px-3 text-muted-foreground italic">
                    {row.comentario_alumno || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
