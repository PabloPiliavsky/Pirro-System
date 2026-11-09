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
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-card border border-border/60 rounded-xl p-3 shadow-sm">
      <AlumnosSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <HStack className="gap-2 flex-wrap sm:flex-nowrap">
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
