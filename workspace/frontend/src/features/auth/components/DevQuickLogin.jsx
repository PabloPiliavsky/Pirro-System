// Anchored to REQ-AUTH-012
import { Button } from '@/components/ui/button'
import { Dumbbell, GraduationCap, ShieldCheck } from 'lucide-react'

const DEMO_USERS = [
  {
    label: 'Prof. Leandro Pirro',
    identifier: 'leandro.pirro',
    password: 'demo123',
    role: 'profesor',
    icon: GraduationCap,
  },
  {
    label: 'Alumno Martín Gómez',
    identifier: 'martin.gomez',
    password: 'demo123',
    role: 'alumno',
    icon: Dumbbell,
  },
  {
    label: 'Alumna Lucía Fernández',
    identifier: 'lucia.fernandez',
    password: 'demo123',
    role: 'alumno',
    icon: Dumbbell,
  },
]

export function DevQuickLogin({ onSelectAccount, isSubmitting }) {
  if (!import.meta.env.DEV) return null

  return (
    <div className="mt-4 rounded-lg border border-dashed border-border/80 bg-secondary/30 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
        <ShieldCheck className="size-3.5" />
        <span>Acceso Rápido de Desarrollo</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        {DEMO_USERS.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.identifier}
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onSelectAccount(item.identifier, item.password)}
              className="flex items-center justify-start gap-1.5 text-xs truncate bg-background/50 hover:bg-background"
            >
              <Icon className="size-3.5 text-primary shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
