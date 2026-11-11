// Anchored to REQ-TRN-007, REQ-TRN-010, REQ-TRN-012
import { HStack } from '@/components/ui/HStack'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export function PlanillaFeedbackAlert({ result, onDismiss }) {
  if (!result) return null

  const isOk = result.ok

  return (
    <div
      className={`p-3.5 rounded-xl border text-xs font-semibold ${
        isOk
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          : 'bg-destructive/15 border-destructive/30 text-destructive'
      }`}
    >
      <HStack justify="between" align="center">
        <HStack align="center" className="gap-2">
          {isOk ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-destructive" />
          )}
          <span>
            {isOk
              ? '¡Entrenamiento guardado con éxito en tu historial!'
              : result.error?.message || 'Error al guardar el entrenamiento.'}
          </span>
        </HStack>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 hover:opacity-70 cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      </HStack>
    </div>
  )
}
