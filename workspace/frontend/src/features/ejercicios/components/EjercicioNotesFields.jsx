// Anchored to REQ-EJE-002
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function EjercicioNotesFields({
  indicaciones,
  setIndicaciones,
  urlVideo,
  setUrlVideo,
  estado,
  setEstado,
}) {
  return (
    <>
      <VStack>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Indicaciones Técnicas
        </label>
        <textarea
          rows={3}
          value={indicaciones}
          onChange={(e) => setIndicaciones(e.target.value)}
          placeholder="Ej: Mantener retracción escapular y no bloquear codos arriba."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        />
      </VStack>

      <VStack>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Enlace de Video (URL demostrativa)
        </label>
        <input
          type="url"
          value={urlVideo}
          onChange={(e) => setUrlVideo(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        />
      </VStack>

      <HStack className="gap-2">
        <input
          type="checkbox"
          id="ejercicioEstado"
          checked={estado}
          onChange={(e) => setEstado(e.target.checked)}
          className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
        />
        <label htmlFor="ejercicioEstado" className="text-sm text-slate-300 cursor-pointer">
          Ejercicio activo en el catálogo
        </label>
      </HStack>
    </>
  )
}
