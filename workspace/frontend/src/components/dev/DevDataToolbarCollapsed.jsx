// TODO: [MOCK-CLEANUP] Eliminar esta barra de desarrollo cuando finalice la migración a Supabase.
// Anchored to REQ-FND-003, REQ-FND-010, REQ-FND-014
import { ChevronUp } from 'lucide-react'

export function DevDataToolbarCollapsed({ mode, onExpand }) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur transition-colors hover:border-primary hover:text-foreground cursor-pointer"
    >
      <span className="size-2 rounded-full bg-primary" />
      <span>DEV: {mode === 'mock' ? 'MOCK LOCAL' : 'SUPABASE'}</span>
      <ChevronUp className="size-3.5" />
    </button>
  )
}
