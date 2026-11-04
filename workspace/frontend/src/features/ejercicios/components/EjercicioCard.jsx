// Anchored to REQ-EJE-006
import React from 'react'

export function EjercicioCard({ ejercicio, onEdit, onDelete }) {
  const eqName = ejercicio.equipamiento_requerido?.nombre || null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{ejercicio.nombre}</h3>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
              ejercicio.estado
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {ejercicio.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-lg uppercase tracking-wider">
            {ejercicio.grupo_muscular}
          </span>
          {ejercicio.requiere_equipamiento ? (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs rounded-lg flex items-center gap-1">
              <span>⚙️</span>
              <span>{eqName || `Máquina #${ejercicio.id_equipamiento_requerido}`}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-800/50 text-slate-400 border border-slate-800 text-xs rounded-lg">
              Peso corporal / Libre
            </span>
          )}
        </div>

        {ejercicio.indicaciones && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {ejercicio.indicaciones}
          </p>
        )}

        {ejercicio.url_video && (
          <a
            href={ejercicio.url_video}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition mb-3 font-medium"
          >
            <span>▶</span> Ver demostración
          </a>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80 mt-2">
        <button
          onClick={() => onEdit(ejercicio)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
        >
          Editar
        </button>
        {ejercicio.estado && (
          <button
            onClick={() => onDelete(ejercicio.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition cursor-pointer"
          >
            Dar de baja
          </button>
        )}
      </div>
    </div>
  )
}
