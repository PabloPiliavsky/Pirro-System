// Anchored to REQ-EJE-002, REQ-EJE-003
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function EjercicioEquipmentFields({
  requiereEq,
  setRequiereEq,
  idEqRequerido,
  setIdEqRequerido,
  equipamientoList = [],
}) {
  return (
    <>
      <HStack className="gap-2">
        <input
          type="checkbox"
          id="requiereEq"
          checked={requiereEq}
          onChange={(e) => {
            setRequiereEq(e.target.checked)
            if (!e.target.checked) setIdEqRequerido('')
          }}
          className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
        />
        <label htmlFor="requiereEq" className="text-sm text-slate-300 cursor-pointer">
          ¿Requiere máquina o equipamiento específico?
        </label>
      </HStack>

      {requiereEq && (
        <VStack>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Equipamiento Requerido <span className="text-red-400 font-bold">*</span>
          </label>
          <select
            value={idEqRequerido}
            onChange={(e) => setIdEqRequerido(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
            required
          >
            <option value="">-- Seleccionar máquina/equipo --</option>
            {equipamientoList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nombre}
              </option>
            ))}
          </select>
        </VStack>
      )}
    </>
  )
}
