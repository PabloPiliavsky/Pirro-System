// Anchored to REQ-PRG-004, REQ-PRG-006, REQ-PRG-012
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { DateFilterInput } from './DateFilterInput'
import { ProgresoViewModeToggle } from './ProgresoViewModeToggle'
import { Filter, RotateCcw, CheckCircle2 } from 'lucide-react'

export function ProgresoFiltersBar({
  draftFilters,
  onChangeDraftFilter,
  onApplyFilters,
  onResetFilters,
  hasPendingChanges,
  rutinasDisponibles,
  ejerciciosDisponibles,
  viewMode,
  onChangeViewMode,
}) {
  function handleFormSubmit(e) {
    e.preventDefault()
    onApplyFilters()
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <form onSubmit={handleFormSubmit}>
        <VStack className="gap-3.5">
          <HStack justify="between" align="center" className="flex-wrap gap-2">
            <HStack align="center" className="gap-2">
              <Filter className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Filtros de Evolución y Modo de Vista
              </span>
            </HStack>
            <ProgresoViewModeToggle viewMode={viewMode} onChangeViewMode={onChangeViewMode} />
          </HStack>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-end gap-3">
            <div className="lg:col-span-2">
              <DateFilterInput
                id="filtro-fecha-desde"
                label="Fecha Desde"
                valueDmy={draftFilters.fechaDesde}
                onChangeDmy={(val) => onChangeDraftFilter('fechaDesde', val)}
              />
            </div>

            <div className="lg:col-span-2">
              <DateFilterInput
                id="filtro-fecha-hasta"
                label="Fecha Hasta"
                valueDmy={draftFilters.fechaHasta}
                onChangeDmy={(val) => onChangeDraftFilter('fechaHasta', val)}
              />
            </div>

            <div className="lg:col-span-3 flex flex-col gap-1">
              <label htmlFor="filtro-rutina" className="text-xs font-semibold text-slate-400">
                Rutina
              </label>
              <select
                id="filtro-rutina"
                aria-label="Filtrar por rutina"
                value={draftFilters.idRutina}
                onChange={(e) => onChangeDraftFilter('idRutina', e.target.value)}
                style={{ textAlignLast: 'center' }}
                className="w-full min-h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-white text-center focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">Todas las rutinas</option>
                {rutinasDisponibles.map((r) => (
                  <option key={r.id} value={r.id}>
                    Día {r.numero_dia} — {r.nombre_rutina}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-1">
              <label htmlFor="filtro-ejercicio" className="text-xs font-semibold text-slate-400">
                Ejercicio
              </label>
              <select
                id="filtro-ejercicio"
                aria-label="Filtrar por ejercicio"
                value={draftFilters.idEjercicio}
                onChange={(e) => onChangeDraftFilter('idEjercicio', e.target.value)}
                style={{ textAlignLast: 'center' }}
                className="w-full min-h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-white text-center focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">Todos los ejercicios</option>
                {ejerciciosDisponibles.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 flex items-center gap-2">
              <Button
                type="submit"
                className={`min-h-10 flex-1 gap-1.5 text-xs font-bold rounded-xl cursor-pointer ${
                  hasPendingChanges
                    ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40'
                    : 'bg-primary/90 text-primary-foreground'
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                Aplicar Filtros
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onResetFilters}
                title="Limpiar filtros"
                aria-label="Limpiar filtros"
                className="min-h-10 px-2.5 rounded-xl border-slate-800 bg-slate-950 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>
        </VStack>
      </form>
    </div>
  )
}
