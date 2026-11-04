// Anchored to REQ-GYM-006
import { HStack } from '@/components/ui/HStack'

export function GimnasiosFilterBar({
  filterStatus,
  onFilterChange,
  totalCount,
  activeCount,
  inactiveCount,
}) {
  return (
    <HStack className="gap-2 border-b border-slate-800/60 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
        Filtrar:
      </span>
      <button
        onClick={() => onFilterChange('ALL')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          filterStatus === 'ALL'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        }`}
      >
        Todas ({totalCount})
      </button>
      <button
        onClick={() => onFilterChange('ACTIVE')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          filterStatus === 'ACTIVE'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        }`}
      >
        Dadas de alta ({activeCount})
      </button>
      <button
        onClick={() => onFilterChange('INACTIVE')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          filterStatus === 'INACTIVE'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        }`}
      >
        Dadas de baja ({inactiveCount})
      </button>
    </HStack>
  )
}
