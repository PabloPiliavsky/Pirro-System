// Anchored to REQ-RUT-009
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function CatalogoFiltros({
  busqueda,
  setBusqueda,
  grupos,
  grupoSeleccionado,
  setGrupoSeleccionado,
}) {
  return (
    <VStack className="py-4 space-y-3 shrink-0">
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o indicación..."
        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
      />

      <HStack className="gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {grupos.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrupoSeleccionado(g)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              grupoSeleccionado === g
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {g}
          </button>
        ))}
      </HStack>
    </VStack>
  )
}

export default CatalogoFiltros
