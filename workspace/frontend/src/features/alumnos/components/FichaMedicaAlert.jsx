// Anchored to REQ-ALU-008
import { VStack } from '@/components/ui/VStack'

export function FichaMedicaAlert({ saludEnfermedades }) {
  const tienePatologias = Boolean(saludEnfermedades?.trim())

  if (tienePatologias) {
    return (
      <VStack className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span>⚠️</span>
          <span>Antecedentes Médicos / Patologías Declaradas</span>
        </div>
        <p className="text-sm mt-1 text-amber-200/90 leading-relaxed">
          {saludEnfermedades}
        </p>
      </VStack>
    )
  }

  return (
    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-sm font-medium">
      <span>✅</span>
      <span>Sin antecedentes clínicos ni patologías declaradas.</span>
    </div>
  )
}
