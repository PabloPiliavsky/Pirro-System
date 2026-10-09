// Anchored to REQ-FND-003, REQ-FND-011, REQ-FND-014
import { useCallback, useEffect, useState } from 'react'
import { ShieldCheck, Sun, Moon, Layers } from 'lucide-react'
import { getProvider } from '@/services/dataProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { RelationalEntityCard } from './RelationalEntityCard'
import { BatchSyncSandbox } from './BatchSyncSandbox'
import { CatalogSummaryPanels } from './CatalogSummaryPanels'

export function FoundationDashboard({ theme, onToggleTheme, refreshToken }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  const loadSummary = useCallback(async () => {
    try {
      setError(null)
      const data = await getProvider().getSystemStatusSummary()
      setSummary(data)
    } catch (err) {
      setError(err?.message || 'Error al consultar el proveedor activo.')
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary, refreshToken])

  const counts = summary?.counts || {}

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
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

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-xs text-foreground">
          Modo Supabase sin servidor activo: {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Alumnos en Cartera (Personas)',
            value: counts.alumnos || 0,
            helper: `${summary?.profesor?.nombre} ${summary?.profesor?.apellido} (Profesor activo)`,
          },
          {
            label: 'Sedes y Ejercicios Disponibles',
            value: `${counts.gimnasios || 0} sedes · ${counts.ejercicios || 0} ejercicios`,
            helper: 'Catálogo con requerimiento de máquina',
          },
          {
            label: 'Sesiones Guardadas en Historial',
            value: `${counts.registros_rutina || 0} sesión (${counts.detalle_series || 0} series)`,
            helper: 'Semilla: 06/10/2026 de Martín Gómez',
          },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="font-mono text-xl font-bold text-primary">{metric.value}</span>
              <span className="text-[11px] text-muted-foreground/80">{metric.helper}</span>
            </CardContent>
          </Card>
        ))}
      </section>

      <Separator />

      <Tabs defaultValue="cartera">
        <TabsList>
          <TabsTrigger value="cartera">
            <Layers className="mr-1.5 size-3.5" />
            Alumnos & Laboratorio Batch
          </TabsTrigger>
          <TabsTrigger value="catalogo">Gimnasios & Catálogo de Ejercicios</TabsTrigger>
        </TabsList>

        <TabsContent value="cartera">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-6">
              {summary?.alumnos?.map((alumno) => (
                <RelationalEntityCard key={alumno.id_persona} alumno={alumno} />
              ))}
            </div>
            <div className="lg:col-span-6">
              <BatchSyncSandbox onBatchSaved={loadSummary} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="catalogo">
          <CatalogSummaryPanels
            gimnasios={summary?.gimnasios}
            ejercicios={summary?.ejercicios}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}
