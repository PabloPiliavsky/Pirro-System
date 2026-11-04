// Anchored to REQ-AUTH-011, REQ-AUTH-013
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { AlumnoBottomNav } from './AlumnoBottomNav'
import { AlumnoNavbar } from './AlumnoNavbar'
import { VStack } from '@/components/ui/VStack'

export function AlumnoLayout({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()

  return (
    <VStack className="min-h-screen bg-background antialiased selection:bg-primary/20">
      <AlumnoNavbar
        user={user}
        logout={logout}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>

      <AlumnoBottomNav />
    </VStack>
  )
}

export default AlumnoLayout
