// Anchored to REQ-AUTH-010
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building2, CalendarDays, Dumbbell, Users } from 'lucide-react'
import { HStack } from '@/components/ui/HStack'

const QUICK_CARDS = [
  { title: 'Alumnos', desc: 'Gestionar fichas y altas', icon: Users, to: '/profesor/alumnos', count: '2 activos' },
  { title: 'Gimnasios', desc: 'Sedes y equipamiento', icon: Building2, to: '/profesor/gimnasios', count: '2 sedes' },
  { title: 'Ejercicios', desc: 'Catálogo de movimientos', icon: Dumbbell, to: '/profesor/ejercicios', count: '6 disponibles' },
  { title: 'Rutinas', desc: 'Armador semanal por día', icon: CalendarDays, to: '/profesor/rutinas', count: '4 activas' },
]

export function ProfesorQuickCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {QUICK_CARDS.map((card) => {
        const Icon = card.icon
        return (
          <Link key={card.title} to={card.to} className="group">
            <Card className="h-full border-border bg-card/80 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-2">
                <HStack justify="between">
                  <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">
                    {card.title}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </HStack>
                <CardDescription className="text-xs">{card.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-semibold text-primary">{card.count}</span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
