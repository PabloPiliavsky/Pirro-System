// Anchored to REQ-AUTH-011, REQ-AUTH-013
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { AlumnoBottomNav } from './AlumnoBottomNav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell, LogOut, MapPin, Moon, Sun } from 'lucide-react'

export function AlumnoLayout({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased selection:bg-primary/20">
      <header className="sticky top-0 z-30 h-15 bg-card/90 backdrop-blur-md border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Dumbbell className="size-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm font-bold text-foreground truncate">
                Hola, {user?.nombre || 'Alumno'}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/40 text-primary">
                ALUMNO
              </Badge>
            </div>
            {user?.nombre_gimnasio && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                <MapPin className="size-3 text-primary shrink-0" />
                <span className="truncate">{user.nombre_gimnasio}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Cambiar tema"
              className="size-9 rounded-md flex items-center justify-center hover:bg-secondary cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="size-4 text-primary" /> : <Moon className="size-4 text-primary" />}
            </button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="size-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>

      <AlumnoBottomNav />
    </div>
  )
}

export default AlumnoLayout
