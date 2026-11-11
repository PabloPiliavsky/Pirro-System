// Anchored to REQ-ALU-007

export function AlumnosSedeSelector({ gimnasios = [], selectedGimnasioId, onGimnasioChange }) {
  const sedesActivas = (gimnasios || []).filter((g) => g.estado)

  return (
    <div className="min-w-[170px]">
      <label
        htmlFor="select-sede-alumnos"
        className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
      >
        Sede
      </label>
      <div className="relative w-full">
        <select
          id="select-sede-alumnos"
          value={selectedGimnasioId}
          onChange={(e) => onGimnasioChange(e.target.value)}
          className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-primary cursor-pointer transition"
        >
          <option value="ALL" className="bg-slate-900 text-white">Todas las sedes</option>
          <option value="NONE" className="bg-slate-900 text-white">Sin sede asignada</option>
          {sedesActivas.map((g) => (
            <option key={g.id} value={g.id} className="bg-slate-900 text-white">
              {g.nombre}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          ▼
        </span>
      </div>
    </div>
  )
}
