// Anchored to REQ-TRN-009, REQ-TRN-010, REQ-TRN-012
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getHistorialAlumno } from '@/services/entrenamientoService'
import { HistorialSessionCard } from './HistorialSessionCard'
import { Card, CardContent } from '@/components/ui/card'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { History, CalendarDays } from 'lucide-react'

export function HistorialEntrenamientosPage() {
  const { user } = useAuth()
  const idAlumno = user?.idPersona || user?.persona?.id || 2
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistorialAlumno(idAlumno)
      .then((data) => setHistorial(data || []))
      .finally(() => setLoading(false))
  }, [idAlumno])

  if (loading) {
    return (
      <VStack align="center" justify="center" className="py-12 gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground">Cargando historial...</span>
      </VStack>
    )
  }

  return (
    <VStack className="gap-4 pb-20">
      <HStack align="center" className="gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <History className="size-5" />
        </div>
        <VStack className="gap-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mi Progreso
          </span>
          <span className="text-base font-black text-foreground">
            Historial de Sesiones
          </span>
        </VStack>
      </HStack>

      {historial.length === 0 ? (
        <Card className="border-border bg-card/60 text-center p-6">
          <CardContent className="p-0">
            <VStack align="center" className="gap-2">
              <CalendarDays className="size-8 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                Sin entrenamientos registrados
              </span>
              <span className="text-xs text-muted-foreground">
                Tus sesiones completadas y guardadas aparecerán listadas aquí.
              </span>
            </VStack>
          </CardContent>
        </Card>
      ) : (
        <VStack className="gap-3">
          {historial.map((session) => (
            <HistorialSessionCard key={session.id} session={session} />
          ))}
        </VStack>
      )}
    </VStack>
  )
}
