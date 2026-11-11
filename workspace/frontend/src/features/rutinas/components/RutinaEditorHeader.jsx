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
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
      <div className="flex-1 max-w-sm w-full">
        <label
          htmlFor="input-nombre-rutina"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
        >
          Nombre / Enfoque del Día {diaActivo}
        </label>
        <input
          id="input-nombre-rutina"
          type="text"
          value={nombreRutina}
          onChange={(e) => setNombreRutina(e.target.value)}
          placeholder={`Ej. Torso - Fuerza (Día ${diaActivo})`}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:border-primary focus:outline-none"
        />
      </div>

      <HStack className="gap-2.5 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onAbrirCatalogo}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer active:scale-95 border border-slate-700 shadow-sm flex items-center gap-1.5"
        >
          <span>➕</span> Agregar Ejercicio
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onGuardar}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-black text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-primary/20 flex items-center gap-1.5"
        >
          {saving ? (
            <div className="size-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>💾</span>
          )}
          <span>{saving ? 'Guardando...' : 'Guardar Día'}</span>
        </button>
      </HStack>
    </div>
  )
}

export default RutinaEditorHeader
