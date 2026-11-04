// Anchored to REQ-AUTH-001
import { Dumbbell } from 'lucide-react'
import { VStack } from '@/components/ui/VStack'

export function LoginBrandingHeader() {
  return (
    <VStack align="center" className="text-center gap-2">
      <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10 mb-1">
        <Dumbbell className="size-8" />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
        Pirro <span className="text-primary font-bold">System</span>
      </h1>
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
        Entrenamiento de Alto Rendimiento
      </p>
    </VStack>
  )
}
