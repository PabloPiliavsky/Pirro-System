// Anchored to REQ-AUTH-010
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Construction } from 'lucide-react'

export function FeaturePlaceholder({ title, description, specNumber }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border bg-card/60 p-6 text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-2">
            <Construction className="size-6" />
          </div>
          <CardTitle className="text-base font-semibold">Módulo Planificado</CardTitle>
          <CardDescription className="text-xs max-w-sm mx-auto">
            Esta sección corresponde a <strong>{specNumber}</strong> de la hoja de ruta de Pirro-System.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Estará disponible en la siguiente etapa de desarrollo.
        </CardContent>
      </Card>
    </div>
  )
}

export default FeaturePlaceholder
