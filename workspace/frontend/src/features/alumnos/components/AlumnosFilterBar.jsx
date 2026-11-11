// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'
import { AlumnosSearchBar } from './AlumnosSearchBar'
import { AlumnosSedeSelector } from './AlumnosSedeSelector'
import { AlumnosStatusTabs } from './AlumnosStatusTabs'

export function AlumnosFilterBar({
  searchTerm,
  onSearchChange,
  gimnasios = [],
  selectedGimnasioId,
  onGimnasioChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-between bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
      <AlumnosSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <HStack className="gap-3 flex-wrap sm:flex-nowrap items-end">
        <AlumnosSedeSelector
          gimnasios={gimnasios}
          selectedGimnasioId={selectedGimnasioId}
          onGimnasioChange={onGimnasioChange}
        />
        <AlumnosStatusTabs
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
        />
      </HStack>
    </div>
  )
}
