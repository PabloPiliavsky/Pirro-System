// Anchored to REQ-FND-003, REQ-FND-011, REQ-FND-014
import { useEffect, useState } from 'react'
import { getProvider } from '@/services/dataProvider'
import { Separator } from '@/components/ui/separator'
import { FoundationHeader } from './FoundationHeader'
import { FoundationMetricsSection } from './FoundationMetricsSection'
import { FoundationTabsSection } from './FoundationTabsSection'

export function FoundationDashboard({ theme, onToggleTheme, refreshToken }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  const loadSummary = async () => {
    try {
      setError(null)
      const data = await getProvider().getSystemStatusSummary()
      setSummary(data)
    } catch (err) {
      setError(err?.message || 'Error al consultar el proveedor activo.')
    }
  }

  useEffect(() => {
    loadSummary()
  }, [refreshToken])

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <FoundationHeader
        summary={summary}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-xs text-foreground">
          Modo Supabase sin servidor activo: {error}
        </div>
      )}

      <FoundationMetricsSection counts={summary?.counts} summary={summary} />

      <Separator />

      <FoundationTabsSection summary={summary} onReload={loadSummary} />
    </main>
  )
}
