// Anchored to REQ-RUT-008, REQ-RUT-010
import { ConstructorAlumnoBadges } from './ConstructorAlumnoBadges'
import { ConstructorAlumnoSelect } from './ConstructorAlumnoSelect'

export function ConstructorAlumnoHeader({
  alumnos = [],
  alumnoSeleccionado = null,
  onSeleccionarAlumno,
  onAbrirFicha,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="w-full max-w-md min-w-0 flex-1">
          <label
            htmlFor="select-alumno"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
          >
            Alumno a Planificar
          </label>
          <ConstructorAlumnoSelect
            alumnos={alumnos}
            alumnoSeleccionado={alumnoSeleccionado}
            onSeleccionarAlumno={onSeleccionarAlumno}
          />
        </div>

        <ConstructorAlumnoBadges
          alumno={alumnoSeleccionado}
          onAbrirFicha={onAbrirFicha}
        />
      </div>
    </div>
  )
}

export default ConstructorAlumnoHeader
