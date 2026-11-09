// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

const STATUS_TABS = [
  { id: 'ACTIVE', label: 'Activos' },
  { id: 'INACTIVE', label: 'Inactivos' },
  { id: 'ALL', label: 'Todos' },
]

export function AlumnosStatusTabs({ statusFilter, onStatusChange }) {
  return (
    <HStack align="center" className="bg-secondary/60 p-1 rounded-lg border border-border/40">
      {STATUS_TABS.map((tab) => (
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
    </HStack>
  )
}
