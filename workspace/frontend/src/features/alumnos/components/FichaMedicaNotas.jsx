// Anchored to REQ-ALU-008
import { formatearFecha } from '../utils/alumnoFormatters'
import { VStack } from '@/components/ui/VStack'

export function FichaMedicaNotas({ alumno }) {
  return (
    <VStack className="space-y-3 pt-2 border-t border-border/40 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Sede Habitual: </span>
          <span className="font-semibold text-foreground">
            {alumno.gimnasio?.nombre || 'Sin sede asignada'}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Fecha de Ingreso: </span>
          <span className="font-semibold text-foreground">
            {formatearFecha(alumno.fecha_ingreso)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Frecuencia Semanal: </span>
          <span className="font-semibold text-foreground">
            {alumno.cantidad_dias_rutina || 3} días
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Contacto: </span>
          <span className="font-semibold text-foreground">
            {alumno.telefono || 'Sin teléfono'}
          </span>
        </div>
      </div>

      {alumno.comentario && (
        <div className="p-3 bg-secondary/30 rounded-lg border border-border/40">
          <span className="text-xs font-semibold text-muted-foreground block mb-1">
            Notas del Profesor / Objetivos:
          </span>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {alumno.comentario}
          </p>
        </div>
      )}
    </VStack>
  )
}
