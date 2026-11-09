// Anchored to REQ-RUT-008, REQ-RUT-010
import { VStack } from '@/components/ui/VStack'
import { ConstructorAlumnoBadges } from './ConstructorAlumnoBadges'

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
            value={alumnoSeleccionado ? alumnoSeleccionado.id_persona : ''}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-semibold cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          >
            <option value="">-- Seleccionar Alumno --</option>
            {alumnos.map((a) => (
              <option key={a.id_persona} value={a.id_persona}>
                {a.nombre_completo}
              </option>
            ))}
          </select>
        </VStack>

        <ConstructorAlumnoBadges
          alumno={alumnoSeleccionado}
          onAbrirFicha={onAbrirFicha}
        />
      </div>
    </div>
  )
}

export default ConstructorAlumnoHeader
