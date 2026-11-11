// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

const STATUS_TABS = [
  { id: 'ACTIVE', label: 'Activos' },
  { id: 'INACTIVE', label: 'Inactivos' },
  { id: 'ALL', label: 'Todos' },
]

export function AlumnosStatusTabs({ statusFilter, onStatusChange }) {
  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        Estado
      </span>
      <HStack align="center" className="bg-slate-950 p-1 rounded-xl border border-slate-800 h-[41px]">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 ${
              statusFilter === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </HStack>
    </div>
  )
}
