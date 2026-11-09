// Anchored to REQ-ALU-002, REQ-ALU-008
import { VStack } from '@/components/ui/VStack'

export function AlumnoFormMedicalFields({
  saludEnfermedades, setSaludEnfermedades,
  comentario, setComentario,
}) {
  return (
    <VStack className="space-y-3 pt-3 border-t border-border/40">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
        3. Ficha Médica y Notas Pedagógicas
      </h3>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Antecedentes Médicos / Enfermedades / Lesiones
        </label>
        <textarea
          rows={2}
          value={saludEnfermedades}
          onChange={(e) => setSaludEnfermedades(e.target.value)}
          placeholder="Ej: Cirugía previa de meniscos rodilla izquierda. Hipertensión controlada..."
          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="text-[10px] text-muted-foreground mt-0.5 block">
          Si se completa, el alumno mostrará un badge de advertencia médica en su tarjeta.
        </span>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Observaciones y Objetivos del Profesor
        </label>
        <textarea
          rows={2}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ej: Objetivo de hipertrofia y acondicionamiento general..."
          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </VStack>
  )
}
