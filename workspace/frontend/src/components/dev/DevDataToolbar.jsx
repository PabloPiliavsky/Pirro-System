// TODO: [MOCK-CLEANUP] Eliminar esta barra de desarrollo cuando finalice la migración a Supabase.
// Anchored to REQ-FND-003, REQ-FND-010, REQ-FND-014
import { useState } from 'react'
import { getActiveDataMode, getProvider, setDevDataMode } from '@/services/dataProvider'
import { VStack } from '@/components/ui/VStack'
import { DevDataToolbarCollapsed } from './DevDataToolbarCollapsed'
import { DevDataToolbarExpanded } from './DevDataToolbarExpanded'

export function DevDataToolbar({ onDataChanged }) {
  const [mode, setMode] = useState(() => getActiveDataMode())
  const [collapsed, setCollapsed] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  if (!import.meta.env.DEV) return null

  const handleSwitchMode = (nextMode) => {
    setDevDataMode(nextMode)
    setMode(nextMode)
    setStatusMessage(`Modo ${nextMode.toUpperCase()} activo`)
    if (onDataChanged) onDataChanged(nextMode)
  }

  const handleResetSeed = async () => {
    const result = await getProvider().resetMockDatabase()
    setStatusMessage(result.ok ? 'Semilla restaurada' : result.message || 'Sin cambios')
    if (onDataChanged) onDataChanged(mode)
  }

  return (
    <VStack
      as="aside"
      align="end"
      aria-label="Selector de entorno de desarrollo"
      className="fixed bottom-3 right-3 z-50 gap-1.5 font-mono text-xs"
    >
      {collapsed ? (
        <DevDataToolbarCollapsed mode={mode} onExpand={() => setCollapsed(false)} />
      ) : (
        <DevDataToolbarExpanded
          mode={mode}
          statusMessage={statusMessage}
          onCollapse={() => setCollapsed(true)}
          onSwitchMode={handleSwitchMode}
          onResetSeed={handleResetSeed}
        />
      )}
    </VStack>
  )
}
