// Anchored to REQ-TRN-004, REQ-TRN-010, REQ-TRN-012
import { VStack } from '@/components/ui/VStack'

export function SerieModalFormFields({ reps, setReps, peso, setPeso, comentario, setComentario }) {
  return (
    <VStack className="gap-3">
      <div className="grid grid-cols-2 gap-3">
        <VStack className="gap-1.5">
          <label htmlFor="modal-reps-input" className="text-xs font-bold text-foreground">
            Reps Realizadas
          </label>
          <input
            id="modal-reps-input"
            type="number"
            min="0"
            max="200"
            required
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full h-12 text-center text-lg font-black rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </VStack>

        <VStack className="gap-1.5">
          <label htmlFor="modal-peso-input" className="text-xs font-bold text-foreground">
            Peso (kg)
          </label>
          <input
            id="modal-peso-input"
            type="number"
            step="0.5"
            min="0"
            max="1000"
            required
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full h-12 text-center text-lg font-black rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </VStack>
      </div>

      <VStack className="gap-1.5">
        <label htmlFor="modal-comentario-input" className="text-xs font-bold text-foreground">
          Comentario (opcional)
        </label>
        <input
          id="modal-comentario-input"
          type="text"
          placeholder="Ej: Buena técnica, al fallo técnico..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </VStack>
    </VStack>
  )
}
