// Anchored to REQ-AUTH-001, REQ-AUTH-003, REQ-AUTH-004, REQ-AUTH-012
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DevQuickLogin } from './DevQuickLogin'
import { AlertCircle, Lock, LogIn, User } from 'lucide-react'

export function LoginForm({ onSubmit, isSubmitting, errorMessage }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!identifier.trim() || !password) return
    onSubmit({ identifier: identifier.trim(), password })
  }

  function handleQuickAccount(quickId, quickPass) {
    setIdentifier(quickId)
    setPassword(quickPass)
    onSubmit({ identifier: quickId, password: quickPass })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-bold">Error de Acceso</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Email o Nombre de Usuario
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="ej. leandro.pirro o tu@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-border bg-secondary/40 pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-border bg-secondary/40 pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !identifier.trim() || !password}
        className="w-full min-h-11 font-semibold uppercase tracking-wider gap-2 shadow-md shadow-primary/20"
      >
        {isSubmitting ? (
          <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          <LogIn className="size-4" />
        )}
        <span>{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
      </Button>

      <DevQuickLogin onSelectAccount={handleQuickAccount} isSubmitting={isSubmitting} />
    </form>
  )
}
