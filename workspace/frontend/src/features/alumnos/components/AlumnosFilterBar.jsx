// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

export function AlumnosFilterBar({
  searchTerm,
  onSearchChange,
  gimnasios = [],
  selectedGimnasioId,
  onGimnasioChange,
  statusFilter,
  onStatusChange,
}) {
  const sedesActivas = (gimnasios || []).filter((g) => g.estado)

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-card border border-border/60 rounded-xl p-3 shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          🔍
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, usuario (@) o correo..."
          className="w-full bg-secondary/50 border border-border/40 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>

      <HStack className="gap-2 flex-wrap sm:flex-nowrap">
        <select
          value={selectedGimnasioId}
          onChange={(e) => onGimnasioChange(e.target.value)}
          className="bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="ALL">Todas las sedes</option>
          <option value="NONE">Sin sede asignada</option>
          {sedesActivas.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-secondary/60 p-1 rounded-lg border border-border/40">
          {[
            { id: 'ACTIVE', label: 'Activos' },
            { id: 'INACTIVE', label: 'Inactivos' },
            { id: 'ALL', label: 'Todos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer active:scale-95 ${
                statusFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </HStack>
    </div>
  )
}
