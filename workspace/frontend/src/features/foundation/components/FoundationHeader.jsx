// Anchored to REQ-FND-003, REQ-FND-014
import { ShieldCheck, Sun, Moon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function FoundationHeader({ summary, theme, onToggleTheme }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            PIRRO-SYSTEM // FUNDACIÓN RELACIONAL
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Profesor Activo: {summary?.profesor?.nombre} {summary?.profesor?.apellido} (@
          {summary?.profesor?.usuario?.nombre_usuario}) · Esquema Dual Mock ↔ Supabase
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="accent" className="font-mono uppercase">
          Proveedor: {summary?.mode || 'mock'}
        </Badge>
        <Button variant="outline" size="sm" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
          {theme === 'dark' ? 'Titanio Claro' : 'Turquesa Grafito'}
        </Button>
      </div>
    </header>
  )
}
