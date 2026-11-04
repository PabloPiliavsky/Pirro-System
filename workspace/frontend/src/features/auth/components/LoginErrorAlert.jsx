// Anchored to REQ-AUTH-003, REQ-AUTH-004
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function LoginErrorAlert({ errorMessage }) {
  if (!errorMessage) return null

  return (
    <Alert variant="destructive" className="py-2.5">
      <AlertCircle className="size-4" />
      <AlertTitle className="text-xs font-bold">Error de Acceso</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}
