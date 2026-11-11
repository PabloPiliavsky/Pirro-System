// Anchored to REQ-EJE-006
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function EjerciciosSearchBar({
  searchQuery,
  onSearchChange,
  muscleGroups = [],
  selectedMuscles = [],
  onToggleMuscleFilter,
}) {
  return (
    <VStack className="gap-4 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="w-full relative">
        <label
          htmlFor="buscar-ejercicios-input"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
        >
          Buscar ejercicios por nombre o indicación:
        </label>
        <div className="relative w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            id="buscar-ejercicios-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre o indicación..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="w-full pt-2 border-t border-slate-800/80">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Filtrar por grupo muscular:
        </span>
        <HStack className="gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap sm:flex-nowrap">
          {muscleGroups.map((group) => {
            const isTodos = group === 'TODOS'
            const active = isTodos
              ? selectedMuscles.length === 0
              : selectedMuscles.includes(group)

            return (
              <button
                key={group}
                type="button"
                onClick={() => onToggleMuscleFilter(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {group}
              </button>
            )
          })}
        </HStack>
      </div>
    </VStack>
  )
}
