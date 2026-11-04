// Anchored to REQ-AUTH-001
import { Lock, User } from 'lucide-react'
import { VStack } from '@/components/ui/VStack'

export function LoginCredentialsFields({
  identifier,
  password,
  onIdentifierChange,
  onPasswordChange,
  isSubmitting,
}) {
  return (
    <>
      <VStack className="gap-1.5">
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
            onChange={(e) => onIdentifierChange(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-border bg-secondary/40 pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </VStack>

      <VStack className="gap-1.5">
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
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-border bg-secondary/40 pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </VStack>
    </>
  )
}
