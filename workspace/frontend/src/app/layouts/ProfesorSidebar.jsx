// Anchored to REQ-AUTH-010
import { NavLink } from 'react-router-dom'
import {
  Building2,
  CalendarDays,
  Dumbbell,
  FileSpreadsheet,
  FlaskConical,
  LayoutDashboard,
  Users,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Panel Principal', path: '/profesor', icon: LayoutDashboard, end: true },
  { label: 'Gimnasios y Sede', path: '/profesor/gimnasios', icon: Building2 },
  { label: 'Catálogo Ejercicios', path: '/profesor/ejercicios', icon: Dumbbell },
  { label: 'Gestión Alumnos', path: '/profesor/alumnos', icon: Users },
  { label: 'Rutinas Semanales', path: '/profesor/rutinas', icon: CalendarDays },
  { label: 'Progreso y Reportes', path: '/profesor/progreso', icon: FileSpreadsheet },
  { label: 'Laboratorio Dev', path: '/profesor/laboratorio', icon: FlaskConical },
]

export function ProfesorSidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Gestión del Profesor
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
