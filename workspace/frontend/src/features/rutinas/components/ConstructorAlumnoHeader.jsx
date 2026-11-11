// Anchored to REQ-RUT-008, REQ-RUT-010
import { ChevronDown } from 'lucide-react'
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="w-full max-w-md min-w-0 flex-1">
          <label
            htmlFor="select-alumno"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
          >
            Alumno a Planificar
          </label>
          <div className="relative w-full">
            <select
              id="select-alumno"
              value={alumnoSeleccionado ? alumnoSeleccionado.id_persona : ''}
              onChange={handleChange}
              className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-primary/60 hover:bg-slate-900 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-white cursor-pointer focus:border-primary focus:outline-none transition-all truncate"
            >
              <option value="" className="bg-slate-900 text-white">-- Seleccionar Alumno --</option>
              {alumnos.map((a) => (
                <option key={a.id_persona} value={a.id_persona} className="bg-slate-900 text-white">
                  {a.nombre_completo}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          </div>
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
