// Anchored to REQ-FND-001, REQ-FND-014
import { useEffect, useState } from 'react'
import { FoundationDashboard } from '@/features/foundation/components/FoundationDashboard'
import { DevDataToolbar } from '@/components/dev/DevDataToolbar'

export function App() {
  const [theme, setTheme] = useState('dark')
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  function handleToggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function handleDataChanged() {
    setRefreshToken((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FoundationDashboard
        theme={theme}
        onToggleTheme={handleToggleTheme}
        refreshToken={refreshToken}
      />
      <DevDataToolbar onDataChanged={handleDataChanged} />
    </div>
  )
}

export default App
