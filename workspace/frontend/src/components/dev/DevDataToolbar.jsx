// Anchored to REQ-FND-003, REQ-FND-010, REQ-FND-014
import { useState } from 'react'
import { Database, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react'
import { getActiveDataMode, getProvider, setDevDataMode } from '@/services/dataProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function DevDataToolbar({ onDataChanged }) {
  const [mode, setMode] = useState(() => getActiveDataMode())
  const [collapsed, setCollapsed] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  if (!import.meta.env.DEV) return null

  function handleSwitchMode(nextMode) {
    setDevDataMode(nextMode)
    setMode(nextMode)
    setStatusMessage(`Modo ${nextMode.toUpperCase()} activo`)
    if (onDataChanged) onDataChanged(nextMode)
  }

  async function handleResetSeed() {
    const result = await getProvider().resetMockDatabase()
    setStatusMessage(result.ok ? 'Semilla restaurada' : result.message || 'Sin cambios')
    if (onDataChanged) onDataChanged(mode)
  }

  return (
    <aside
      aria-label="Selector de entorno de desarrollo"
      className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-1.5 font-mono text-xs"
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur transition-colors hover:border-primary hover:text-foreground cursor-pointer"
        >
          <span className="size-2 rounded-full bg-primary" />
          <span>DEV: {mode === 'mock' ? 'MOCK LOCAL' : 'SUPABASE'}</span>
          <ChevronUp className="size-3.5" />
        </button>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <Database className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">Entorno DEV</span>
            </div>
            <button
              type="button"
              aria-label="Minimizar barra DEV"
              onClick={() => setCollapsed(true)}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={mode === 'mock' ? 'default' : 'secondary'}
              onClick={() => handleSwitchMode('mock')}
            >
              MOCK LOCAL
            </Button>
            <Button
              size="sm"
              variant={mode === 'supabase' ? 'default' : 'secondary'}
              onClick={() => handleSwitchMode('supabase')}
            >
              SUPABASE
            </Button>
            {mode === 'mock' && (
              <Button size="sm" variant="outline" onClick={handleResetSeed}>
                <RotateCcw data-icon="inline-start" />
                Restaurar Semilla
              </Button>
            )}
          </div>
          {statusMessage && (
            <Badge variant="secondary" className="justify-center text-[11px]">
              {statusMessage}
            </Badge>
          )}
        </div>
      )}
    </aside>
  )
}
