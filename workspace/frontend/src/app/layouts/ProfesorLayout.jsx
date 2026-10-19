// Anchored to REQ-AUTH-010, REQ-AUTH-013
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { ProfesorSidebar } from './ProfesorSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'

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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 bg-card/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-secondary md:hidden cursor-pointer"
              aria-label="Abrir menú"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Dumbbell className="size-5 text-primary" />
              <span className="font-black text-sm tracking-tight text-foreground uppercase">
                Pirro <span className="text-primary font-bold">System</span>
              </span>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex border-primary/40 text-primary text-xs">
              PROFESOR
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground hidden sm:inline">
              Prof. {user?.nombre} {user?.apellido}
            </span>

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Cambiar tema"
                className="p-2 rounded-md hover:bg-secondary cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="size-4 text-primary" /> : <Moon className="size-4 text-primary" />}
              </button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProfesorLayout
