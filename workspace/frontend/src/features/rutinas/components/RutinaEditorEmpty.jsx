// Anchored to REQ-RUT-008
import { VStack } from '@/components/ui/VStack'

export function RutinaEditorEmpty({ diaActivo, onAbrirCatalogo }) {
  return (
    <VStack className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-secondary/10">
      <p className="text-3xl mb-2">🏋️</p>
      <h4 className="text-sm font-bold text-foreground mb-1">
        No hay ejercicios programados para el Día {diaActivo}
      </h4>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
        Agrega ejercicios del catálogo para estructurar la sesión de entrenamiento.
      </p>
      <button
        type="button"
        onClick={onAbrirCatalogo}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-sm"
      >
        + Abrir Catálogo
      </button>
    </VStack>
  )
}

export default RutinaEditorEmpty
