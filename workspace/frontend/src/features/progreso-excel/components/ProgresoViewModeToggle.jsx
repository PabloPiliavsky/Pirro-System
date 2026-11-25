// Anchored to REQ-PRG-006, REQ-PRG-012
import { HStack } from '@/components/ui/HStack'
import { LayoutList, Table2 } from 'lucide-react'

export function ProgresoViewModeToggle({ viewMode, onChangeViewMode }) {
  return (
    <HStack
      role="group"
      aria-label="Selector de modo de visualización"
      className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1"
    >
      <button
        type="button"
        onClick={() => onChangeViewMode('sesiones')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
          viewMode === 'sesiones'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <LayoutList className="size-3.5" />
        Por Sesión
      </button>
      <button
        type="button"
        onClick={() => onChangeViewMode('tabla')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
          viewMode === 'tabla'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Table2 className="size-3.5" />
        Tabla de Series
      </button>
    </HStack>
  )
}
