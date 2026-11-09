// Anchored to REQ-RUT-008, REQ-RUT-010
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function ConstructorAlumnoHeader({
  alumnos = [],
  alumnoSeleccionado = null,
  onSeleccionarAlumno,
  onAbrirFicha,
}) {
  const handleChange = (e) => {
    const val = e.target.value
    if (!val) {
      onSeleccionarAlumno(null)
      return
    }
    const target = alumnos.find((a) => String(a.id_persona) === String(val))
    onSeleccionarAlumno(target || null)
  }

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <VStack className="space-y-1.5 flex-1 max-w-md">
          <label htmlFor="select-alumno" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Alumno a Planificar
          </label>
          <select
            id="select-alumno"
            value={alumnoSeleccionado?.id_persona || ''}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-semibold cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          >
            <option value="">-- Seleccionar Alumno --</option>
            {alumnos.map((a) => (
              <option key={a.id_persona} value={a.id_persona}>
                {a.nombre_completo || `${a.nombre} ${a.apellido}`}
              </option>
            ))}
          </select>
        </VStack>

        {alumnoSeleccionado && (
          <HStack className="flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/50 border border-border px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground">
              <span className="text-muted-foreground">Sede:</span>
              <span className="text-primary font-bold">
                {alumnoSeleccionado.gimnasio?.nombre || 'Sin Sede Asignada'}
              </span>
            </div>

            <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold text-primary">
              {alumnoSeleccionado.cantidad_dias_rutina || 3} Días / Sem
            </div>

            {alumnoSeleccionado.salud_enfermedades && (
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <span>⚠️</span> Condición médica
              </span>
            )}

            <button
              type="button"
              onClick={() => onAbrirFicha(alumnoSeleccionado)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 border border-border shadow-sm flex items-center gap-2"
            >
              <span>📋</span> Ver Ficha Médica
            </button>
          </HStack>
        )}
      </div>
    </div>
  )
}

export default ConstructorAlumnoHeader
