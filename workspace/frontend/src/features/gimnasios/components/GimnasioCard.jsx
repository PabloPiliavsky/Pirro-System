// Anchored to REQ-GYM-006
import React from 'react'

function formatTime(timeStr) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
  return timeStr
}

export function GimnasioCard({ gimnasio, onEdit, onDelete, onReactivate }) {
  const equipamientos = gimnasio.equipamiento_disponible || []
  const apertura = formatTime(gimnasio.horario_apertura)
  const cierre = formatTime(gimnasio.horario_cierre)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{gimnasio.nombre}</h3>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
              gimnasio.estado
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {gimnasio.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-3 flex items-center gap-1.5">
          <span>📍</span>
          <span>{gimnasio.direccion || 'Sin dirección registrada'}</span>
        </p>

        {(apertura || cierre) && (
          <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
            <span>⏰</span>
            <span>
              {apertura || '08:00'} - {cierre || '22:00'}
            </span>
          </p>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Equipamiento ({equipamientos.length})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {equipamientos.length > 0 ? (
              equipamientos.map((item) => (
                <span
                  key={item.id_equipamiento}
                  className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700"
                >
                  {item.equipamiento?.nombre || `Equipo #${item.id_equipamiento}`}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Sin equipamiento asignado</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80 mt-2">
        <button
          onClick={() => onEdit(gimnasio)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
        >
          Editar
        </button>
        {gimnasio.estado ? (
          <button
            onClick={() => onDelete(gimnasio.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition cursor-pointer"
          >
            Dar de baja
          </button>
        ) : (
          <button
            onClick={() => onReactivate && onReactivate(gimnasio)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition cursor-pointer"
          >
            Dar de alta
          </button>
        )}
      </div>
    </div>
  )
}
