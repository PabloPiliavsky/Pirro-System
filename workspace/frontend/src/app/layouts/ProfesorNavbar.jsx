// Anchored to REQ-AUTH-010, REQ-AUTH-013
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { HStack } from '@/components/ui/HStack'

export function ProfesorNavbar({ user, logout, sidebarOpen, onToggleSidebar, theme, onToggleTheme }) {
  return (
    <HStack
      as="header"
      justify="between"
      className="sticky top-0 z-10 h-16 bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-6"
    >
      <HStack className="gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-secondary md:hidden cursor-pointer"
          aria-label="Abrir menú"
        >
          {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <HStack className="gap-2">
          <Dumbbell className="size-5 text-primary" />
          <span className="font-black text-sm tracking-tight text-foreground uppercase">
            Pirro <span className="text-primary font-bold">System</span>
          </span>
        </HStack>
        <Badge variant="outline" className="hidden sm:inline-flex border-primary/40 text-primary text-xs">
          PROFESOR
        </Badge>
      </HStack>

      <HStack className="gap-3">
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
      </HStack>
    </HStack>
  )
}
