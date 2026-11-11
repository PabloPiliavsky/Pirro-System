// Anchored to REQ-TRN-002, REQ-TRN-010, REQ-TRN-012
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { Calendar, Dumbbell } from 'lucide-react'

export function EntrenamientoHeader({
  rutinas,
  selectedRutinaId,
  onSelectRutinaId,
  fechaRealizacion,
  onChangeFecha,
}) {
  return (
    <VStack className="gap-3">
      <HStack justify="between" align="center" className="flex-wrap gap-2">
        <HStack align="center" className="gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Dumbbell className="size-5" />
          </div>
          <VStack className="gap-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mi Planilla
            </span>
            <span className="text-base font-black text-foreground">
              Entrenamiento en Vivo
            </span>
          </VStack>
        </HStack>

        <HStack align="center" className="gap-1.5 bg-card px-2.5 py-1 rounded-xl border border-border">
          <Calendar className="size-3.5 text-primary" />
          <input
            type="date"
            value={fechaRealizacion}
            onChange={(e) => onChangeFecha(e.target.value)}
            className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
          />
        </HStack>
      </HStack>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {rutinas.map((r) => {
          const isSelected = r.id === selectedRutinaId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRutinaId(r.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {r.nombre_rutina || `Día ${r.numero_dia}`}
            </button>
          )
        })}
      </div>
    </VStack>
  )
}
