// Anchored to REQ-FND-008, REQ-FND-013
import { PlusCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BatchSyncActions({ onAddSerie, onCommit, isSaving, hasSeries }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={onAddSerie}>
        <PlusCircle data-icon="inline-start" />
        Cargar Serie en LocalStorage
      </Button>
      <Button disabled={!hasSeries || isSaving} onClick={onCommit}>
        <Save data-icon="inline-start" />
        Guardar Entrenamiento (Batch)
      </Button>
    </div>
  )
}
