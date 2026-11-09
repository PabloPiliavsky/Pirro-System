// Anchored to REQ-RUT-003, REQ-RUT-005, REQ-RUT-008
import { RutinaEjercicioItem } from './RutinaEjercicioItem'

export function RutinaEditorPanel({
  diaActivo,
  nombreRutina,
  setNombreRutina,
  ejerciciosDia,
  gimnasio,
  onAbrirCatalogo,
  onActualizarEjercicio,
  onMoverEjercicio,
  onEliminarEjercicio,
  onGuardar,
  saving,
}) {
  return (
    <div className="bg-card/60 border border-border rounded-2xl p-5 space-y-5 backdrop-blur-sm">
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

        <div className="flex items-center gap-2 self-end sm:self-auto">
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
        </div>
      </div>

      <div className="space-y-3">
        {ejerciciosDia.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-secondary/10">
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
          </div>
        ) : (
          ejerciciosDia.map((item, idx) => (
            <RutinaEjercicioItem
              key={`${item.id_ejercicio}-${idx}`}
              item={item}
              index={idx}
              total={ejerciciosDia.length}
              gimnasio={gimnasio}
              onActualizar={onActualizarEjercicio}
              onMover={onMoverEjercicio}
              onEliminar={onEliminarEjercicio}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default RutinaEditorPanel
