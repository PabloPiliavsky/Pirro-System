// Anchored to REQ-RUT-008, REQ-RUT-010
import { Check } from 'lucide-react'

export function ConstructorAlumnoDropdownList({
  alumnos = [],
  alumnoSeleccionado = null,
  onSelect,
}) {
  return (
    <div className="absolute top-full left-0 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800/80 animate-in fade-in-50 zoom-in-95 duration-100">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="w-full px-4 py-3 text-left text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
      >
        -- Deseleccionar Alumno --
      </button>
      {alumnos.map((a) => {
        const isSelected = alumnoSeleccionado?.id_persona === a.id_persona
        return (
          <button
            key={a.id_persona}
            type="button"
            onClick={() => onSelect(a)}
            className={`w-full px-4 py-3 flex items-center justify-between text-left text-sm transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary/15 text-primary font-bold'
                : 'text-slate-200 hover:bg-slate-900 hover:text-primary font-medium'
            }`}
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="truncate">{a.nombre_completo}</span>
              {a.sede && (
                <span className="text-xs text-slate-500 font-normal truncate mt-0.5">
                  {a.sede.nombre || a.sede}
                </span>
              )}
            </div>
            {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
          </button>
        )
      })}
    </div>
  )
}

export default ConstructorAlumnoDropdownList
