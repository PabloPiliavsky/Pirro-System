// Anchored to REQ-RUT-008, REQ-RUT-010
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { ConstructorAlumnoDropdownList } from './ConstructorAlumnoDropdownList'

export function ConstructorAlumnoSelect({
  alumnos = [],
  alumnoSeleccionado = null,
  onSeleccionarAlumno,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

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

  const handleSelect = (alumno) => {
    onSeleccionarAlumno(alumno)
    setIsOpen(false)
  }

  const handleNativeChange = (e) => {
    const val = e.target.value
    const target = alumnos.find((a) => String(a.id_persona) === String(val))
    onSeleccionarAlumno(target || null)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <select
        id="select-alumno"
        value={alumnoSeleccionado ? alumnoSeleccionado.id_persona : ''}
        onChange={handleNativeChange}
        className="sr-only"
      >
        <option value="">-- Seleccionar Alumno --</option>
        {alumnos.map((a) => (
          <option key={a.id_persona} value={a.id_persona}>
            {a.nombre_completo}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 hover:border-primary/60 hover:bg-slate-900 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all text-left shadow-sm cursor-pointer"
      >
        <span className="truncate">
          {alumnoSeleccionado ? alumnoSeleccionado.nombre_completo : '-- Seleccionar Alumno --'}
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ConstructorAlumnoDropdownList
          alumnos={alumnos}
          alumnoSeleccionado={alumnoSeleccionado}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

export default ConstructorAlumnoSelect
