// Anchored to REQ-ALU-002, REQ-ALU-004
import { HStack } from '@/components/ui/HStack'

export function AlumnoFormImcToggle({ mostrarImc, setMostrarImc }) {
  return (
    <HStack align="start" className="p-3 bg-secondary/30 rounded-xl border border-border/40 gap-3">
      <input
        id="toggleMostrarImc"
        type="checkbox"
        checked={mostrarImc}
        onChange={(e) => setMostrarImc(e.target.checked)}
        className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
      />
      <label htmlFor="toggleMostrarImc" className="text-xs text-foreground cursor-pointer select-none">
        <span className="font-semibold block">Habilitar visualización de IMC al alumno</span>
        <span className="text-[11px] text-muted-foreground block mt-0.5">
          Por defecto permanece oculto. Activá esta opción sólo si el alumno te solicitó explícitamente ver su IMC estimado en su ficha.
        </span>
      </label>
    </HStack>
  )
}
