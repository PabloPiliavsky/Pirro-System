// Anchored to REQ-AUTH-010
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, CalendarDays, Dumbbell, FileSpreadsheet, FlaskConical, Users } from 'lucide-react'

const QUICK_CARDS = [
  { title: 'Alumnos', desc: 'Gestionar fichas y altas', icon: Users, to: '/profesor/alumnos', count: '2 activos' },
  { title: 'Gimnasios', desc: 'Sedes y equipamiento', icon: Building2, to: '/profesor/gimnasios', count: '2 sedes' },
  { title: 'Ejercicios', desc: 'Catálogo de movimientos', icon: Dumbbell, to: '/profesor/ejercicios', count: '6 disponibles' },
  { title: 'Rutinas', desc: 'Armador semanal por día', icon: CalendarDays, to: '/profesor/rutinas', count: '4 activas' },
]

export function ProfesorHome() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Panel de Control
          </h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido, Prof. {user?.nombre} {user?.apellido}. Resumen operativo de Pirro-System.
          </p>
        </div>
        <Link to="/profesor/laboratorio">
          <Button variant="outline" size="sm" className="gap-2">
            <FlaskConical className="size-4 text-primary" />
            <span>Laboratorio & Diagnóstico</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} to={card.to} className="group">
              <Card className="h-full border-border bg-card/80 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">
                      {card.title}
                    </CardTitle>
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
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

      <Card className="border-border bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileSpreadsheet className="size-4 text-primary" />
            <span>Siguientes Módulos de la Hoja de Ruta</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Specs 003 a 007 habilitarán el ABM de Gimnasios, Ficha Médica de Alumnos, Constructor de Rutinas y Reportes Excel.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default ProfesorHome
