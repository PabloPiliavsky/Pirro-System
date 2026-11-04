// Anchored to REQ-AUTH-010, REQ-AUTH-013
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { ProfesorSidebar } from './ProfesorSidebar'
import { ProfesorNavbar } from './ProfesorNavbar'
import { VStack } from '@/components/ui/VStack'

export function ProfesorLayout({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <ProfesorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs"
        />
      )}

      <VStack className="flex-1 min-w-0">
        <ProfesorNavbar
          user={user}
          logout={logout}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </VStack>
    </div>
  )
}

export default ProfesorLayout
