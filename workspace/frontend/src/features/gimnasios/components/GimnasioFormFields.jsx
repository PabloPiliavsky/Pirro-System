// Anchored to REQ-GYM-002
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function GimnasioFormFields({
  nombre,
  setNombre,
  direccion,
  setDireccion,
  horarioApertura,
  setHorarioApertura,
  horarioCierre,
  setHorarioCierre,
  estado,
  setEstado,
}) {
  return (
    <>
      <p className="text-[11px] text-slate-400">
        Los campos marcados con <span className="text-red-400 font-bold">*</span> son obligatorios.
      </p>

      <VStack>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Nombre de la sede <span className="text-red-400 font-bold">*</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Sede Central"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
          required
        />
      </VStack>

      <VStack>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Dirección
        </label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej: Av. Corrientes 1234"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        />
      </VStack>

      <div className="grid grid-cols-2 gap-4">
        <VStack>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Apertura (HH:MM)
          </label>
          <input
            type="text"
            value={horarioApertura}
            onChange={(e) => setHorarioApertura(e.target.value)}
            placeholder="08:00"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
          />
        </VStack>
        <VStack>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Cierre (HH:MM)
          </label>
          <input
            type="text"
            value={horarioCierre}
            onChange={(e) => setHorarioCierre(e.target.value)}
            placeholder="22:00"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
          />
        </VStack>
      </div>

      <HStack className="gap-2">
        <input
          type="checkbox"
          id="gymEstado"
          checked={estado}
          onChange={(e) => setEstado(e.target.checked)}
          className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
        />
        <label htmlFor="gymEstado" className="text-sm text-slate-300 cursor-pointer">
          Sede activa / operativa
        </label>
      </HStack>
    </>
  )
}
