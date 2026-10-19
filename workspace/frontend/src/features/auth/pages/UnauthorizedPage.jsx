// Anchored to REQ-AUTH-008
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full border-destructive/40 bg-card text-center">
        <CardHeader className="pb-3">
          <div className="mx-auto size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-lg font-bold">Acceso No Autorizado</CardTitle>
          <CardDescription className="text-xs">
            No contás con los permisos necesarios para acceder a esta sección o tu cuenta está deshabilitada.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Volver a Iniciar Sesión</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnauthorizedPage
