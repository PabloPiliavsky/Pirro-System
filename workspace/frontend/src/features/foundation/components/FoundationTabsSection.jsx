// Anchored to REQ-FND-003, REQ-FND-011, REQ-FND-014
import { Layers } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { VStack } from '@/components/ui/VStack'
import { RelationalEntityCard } from './RelationalEntityCard'
import { BatchSyncSandbox } from './BatchSyncSandbox'
import { CatalogSummaryPanels } from './CatalogSummaryPanels'

export function FoundationTabsSection({ summary, onReload }) {
  return (
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
          <VStack className="gap-4 lg:col-span-6">
            {summary?.alumnos?.map((alumno) => (
              <RelationalEntityCard key={alumno.id_persona} alumno={alumno} />
            ))}
          </VStack>
          <div className="lg:col-span-6">
            <BatchSyncSandbox onBatchSaved={onReload} />
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
  )
}
