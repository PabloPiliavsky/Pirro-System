// Anchored to REQ-RUT-009
import { useRef } from 'react'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function CatalogoFiltros({
  busqueda,
  setBusqueda,
  grupos,
  grupoSeleccionado,
  setGrupoSeleccionado,
}) {
  const scrollRef = useRef(null)

  function desplazar(direccion) {
    if (!scrollRef.current) return
    const offset = direccion === 'izq' ? -130 : 130
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <VStack className="py-4 space-y-3 shrink-0">
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o indicación..."
        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
      />

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => desplazar('izq')}
          title="Desplazar filtros a la izquierda"
          className="w-7 h-7 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold flex items-center justify-center shrink-0 mr-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
        >
          ‹
        </button>

        <HStack
          ref={scrollRef}
          className="gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-1"
        >
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

        <button
          type="button"
          onClick={() => desplazar('der')}
          title="Desplazar filtros a la derecha"
          className="w-7 h-7 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold flex items-center justify-center shrink-0 ml-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
        >
          ›
        </button>
      </div>
    </VStack>
  )
}

export default CatalogoFiltros
