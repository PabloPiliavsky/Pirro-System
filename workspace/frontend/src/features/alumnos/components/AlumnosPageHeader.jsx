// Anchored to REQ-ALU-007
import { HStack } from '@/components/ui/HStack'

export function AlumnosPageHeader({ totalCount, onOpenCreate }) {
  return (
    <HStack justify="between" align="center" className="gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
          <span>👥</span>
          <span>Gestión de Alumnos</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Cartera de alumnos ({totalCount} registrados) con fichas médicas y biometría.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenCreate}
        className="px-4 py-2 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
      >
        <span>+</span>
        <span>Nuevo Alumno</span>
      </button>
    </HStack>
  )
}
