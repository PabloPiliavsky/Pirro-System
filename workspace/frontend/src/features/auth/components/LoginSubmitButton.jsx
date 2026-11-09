// Anchored to REQ-AUTH-001
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LoginSubmitButton({ isSubmitting, isDisabled }) {
  const icon = isSubmitting ? (
    <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
  ) : (
    <LogIn className="size-4" />
  )
  const label = isSubmitting ? 'Verificando...' : 'Iniciar Sesión'

  return (
    <Button
      type="submit"
      disabled={isDisabled || isSubmitting}
      className="w-full min-h-11 font-semibold uppercase tracking-wider gap-2 shadow-md shadow-primary/20"
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}
