// Anchored to REQ-AUTH-010
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, FlaskConical } from 'lucide-react'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { ProfesorQuickCards } from '../components/ProfesorQuickCards'

export function ProfesorHome() {
  const { user } = useAuth()

  return (
    <VStack className="gap-6">
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

      <ProfesorQuickCards />

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
    </VStack>
  )
}

export default ProfesorHome
