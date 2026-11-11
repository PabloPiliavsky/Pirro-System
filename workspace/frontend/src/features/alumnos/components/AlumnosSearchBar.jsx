// Anchored to REQ-ALU-007

export function AlumnosSearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="flex-1 min-w-[260px]">
      <label
        htmlFor="buscar-alumnos-input"
        className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
      >
        Buscar alumnos
      </label>
      <div className="relative w-full">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          🔍
        </span>
        <input
          id="buscar-alumnos-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, usuario (@) o correo..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
