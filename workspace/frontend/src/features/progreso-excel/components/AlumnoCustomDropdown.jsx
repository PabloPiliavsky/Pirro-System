// Anchored to REQ-PRG-002, REQ-PRG-003, REQ-PRG-012
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export function AlumnoCustomDropdown({ alumnos, selectedAlumnoId, onSelectAlumno }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const selectedObj = alumnos.find((a) => Number(a.id_persona) === Number(selectedAlumnoId)) || null

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative w-full">
      <select
        id="select-alumno-progreso"
        aria-label="Seleccionar alumno"
        value={selectedAlumnoId || ''}
        onChange={(e) => onSelectAlumno(Number(e.target.value))}
        className="sr-only"
      >
        {alumnos.map((al) => (
          <option key={al.id_persona} value={al.id_persona}>
            {al.nombre_completo} {!al.estado ? '(Inactivo)' : ''}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 hover:border-primary/60 hover:bg-slate-900 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all text-left shadow-sm cursor-pointer"
      >
        <span className="truncate">
          {selectedObj
            ? `${selectedObj.nombre_completo}${!selectedObj.estado ? ' (Inactivo)' : ''}`
            : '-- Seleccionar Alumno --'}
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800/80">
          {alumnos.map((a) => {
            const isSelected = Number(selectedAlumnoId) === Number(a.id_persona)
            return (
              <button
                key={a.id_persona}
                type="button"
                onClick={() => {
                  onSelectAlumno(Number(a.id_persona))
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 flex items-center justify-between text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary/15 text-primary font-bold'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-primary font-medium'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="truncate">
                    {a.nombre_completo} {!a.estado ? '(Inactivo)' : ''}
                  </span>
                  {a.gimnasio?.nombre && (
                    <span className="text-xs text-slate-500 font-normal truncate mt-0.5">
                      {a.gimnasio.nombre}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
