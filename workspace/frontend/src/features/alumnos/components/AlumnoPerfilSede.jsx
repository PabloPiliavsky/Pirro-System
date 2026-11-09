// Anchored to REQ-ALU-009
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilSede({ gimnasio }) {
  if (!gimnasio) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-5 text-sm text-muted-foreground text-center">
        📍 Todavía no tenés una sede asignada. Consultale a tu profesor.
      </div>
    )
  }

  return (
    <VStack className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-2">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Tu Gimnasio / Sede
      </h2>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {gimnasio.nombre}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            📍 {gimnasio.direccion || 'Sin dirección registrada'}
          </p>
          {(gimnasio.horario_apertura || gimnasio.horario_cierre) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ⏰ Horario: {gimnasio.horario_apertura?.slice(0, 5) || '08:00'} - {gimnasio.horario_cierre?.slice(0, 5) || '22:00'}
            </p>
          )}
        </div>
      </div>
    </VStack>
  )
}
