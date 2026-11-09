// Anchored to REQ-RUT-003, REQ-RUT-008
import { HStack } from '@/components/ui/HStack'

export function RutinaEditorHeader({
  diaActivo,
  nombreRutina,
  setNombreRutina,
  onAbrirCatalogo,
  onGuardar,
  saving,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
      <div className="flex-1 max-w-sm">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
          Nombre / Enfoque del Día {diaActivo}
        </label>
        <input
          type="text"
          value={nombreRutina}
          onChange={(e) => setNombreRutina(e.target.value)}
          placeholder={`Ej. Torso - Fuerza (Día ${diaActivo})`}
          className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <HStack className="gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onAbrirCatalogo}
          className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all cursor-pointer active:scale-95 border border-border shadow-sm flex items-center gap-1.5"
        >
          <span>➕</span> Agregar Ejercicio
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onGuardar}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-black text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-primary/20 flex items-center gap-1.5"
        >
          <span>💾</span> {saving ? 'Guardando...' : 'Guardar Día'}
        </button>
      </HStack>
    </div>
  )
}

export default RutinaEditorHeader
