import { cn } from '@/lib/utils'

// Anchored to REQ-FND-001, REQ-FND-002
export function Alert({ className, variant = 'default', ...props }) {
  const variantClasses =
    variant === 'destructive'
      ? 'border-destructive/60 bg-destructive/10 text-foreground'
      : 'border-border bg-secondary/60 text-foreground'

  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 text-sm', variantClasses, className)}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }) {
  return <h5 className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />
}

export function AlertDescription({ className, ...props }) {
  return <div className={cn('text-xs text-muted-foreground leading-relaxed', className)} {...props} />
}
