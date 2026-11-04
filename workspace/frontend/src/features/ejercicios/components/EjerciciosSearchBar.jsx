// Anchored to REQ-EJE-006
import { HStack } from '@/components/ui/HStack'

export function EjerciciosSearchBar({
  searchQuery,
  onSearchChange,
  muscleGroups = [],
  selectedMuscles = [],
  onToggleMuscleFilter,
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o indicación..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary"
        />
      </div>
      <HStack className="gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {group}
            </button>
          )
        })}
      </HStack>
    </div>
  )
}
