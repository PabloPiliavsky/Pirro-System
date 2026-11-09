// Anchored to REQ-ALU-006
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'

export function ConfirmarBajaModal({ alumno, onClose, onConfirm, submitting }) {
  if (!alumno) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <VStack className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center text-lg shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Confirmar Baja de Alumno
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {alumno.nombre_completo} (@{alumno.nombre_usuario})
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed">
          ¿Estás seguro de que deseás dar de baja a <span className="font-bold">{alumno.nombre_completo}</span>?
        </p>

        <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-xs text-muted-foreground leading-relaxed">
          ℹ️ El alumno ya no podrá iniciar sesión en Pirro-System. Todo su historial de rutinas, series y cargas completadas se conservará intacto y podrás reactivarlo cuando quieras desde la pestaña <span className="font-semibold text-foreground">"Inactivos"</span>.
        </div>

        <HStack justify="end" className="gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(alumno.id_persona, false)}
            disabled={submitting}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Procesando...' : 'Sí, dar de baja'}
          </button>
        </HStack>
      </VStack>
    </div>
  )
}

export default ConfirmarBajaModal
