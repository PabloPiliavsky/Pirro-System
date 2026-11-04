// Anchored to REQ-FND-003, REQ-FND-014
import { ShieldCheck, Sun, Moon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function FoundationHeader({ summary, theme, onToggleTheme }) {
  return (
    <HStack
      as="header"
      wrap
      justify="between"
      className="gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <VStack className="gap-1">
        <HStack className="gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            PIRRO-SYSTEM // FUNDACIÓN RELACIONAL
          </h1>
        </HStack>
        <p className="text-xs text-muted-foreground">
          Profesor Activo: {summary?.profesor?.nombre} {summary?.profesor?.apellido} (@
          {summary?.profesor?.usuario?.nombre_usuario}) · Esquema Dual Mock ↔ Supabase
        </p>
      </VStack>
      <HStack className="gap-2">
        <Badge variant="accent" className="font-mono uppercase">
          Proveedor: {summary?.mode || 'mock'}
        </Badge>
        <Button variant="outline" size="sm" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
          {theme === 'dark' ? 'Titanio Claro' : 'Turquesa Grafito'}
        </Button>
      </HStack>
    </HStack>
  )
}
