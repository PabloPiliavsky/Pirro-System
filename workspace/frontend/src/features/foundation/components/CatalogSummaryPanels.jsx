// Anchored to REQ-FND-005, REQ-FND-006, REQ-FND-014
import { GymCatalogCard } from './GymCatalogCard'
import { ExerciseCatalogCard } from './ExerciseCatalogCard'

export function CatalogSummaryPanels({ gimnasios = [], ejercicios = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <GymCatalogCard gimnasios={gimnasios} />
      <ExerciseCatalogCard ejercicios={ejercicios} />
    </div>
  )
}
