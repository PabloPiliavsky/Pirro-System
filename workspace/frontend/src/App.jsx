// Anchored to REQ-AUTH-006, REQ-FND-001, REQ-FND-014
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { AppRoutes } from '@/app/AppRoutes'
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
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes
            theme={theme}
            onToggleTheme={handleToggleTheme}
            refreshToken={refreshToken}
          />
          <DevDataToolbar onDataChanged={handleDataChanged} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
