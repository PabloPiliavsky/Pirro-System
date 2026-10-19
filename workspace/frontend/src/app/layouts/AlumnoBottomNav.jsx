// Anchored to REQ-AUTH-011
import { NavLink } from 'react-router-dom'
import { CalendarDays, Dumbbell, History, User } from 'lucide-react'

const NAV_TABS = [
  { label: 'Entrenar', path: '/alumno', icon: Dumbbell, end: true },
  { label: 'Rutinas', path: '/alumno/rutinas', icon: CalendarDays },
  { label: 'Historial', path: '/alumno/historial', icon: History },
  { label: 'Mi Perfil', path: '/alumno/perfil', icon: User },
]

export function AlumnoBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="grid grid-cols-4 max-w-md mx-auto h-16">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-14 gap-1 select-none transition-colors ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="size-5" />
              <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
