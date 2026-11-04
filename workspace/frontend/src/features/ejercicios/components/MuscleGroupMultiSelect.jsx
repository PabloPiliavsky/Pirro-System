// Anchored to REQ-EJE-002, REQ-EJE-006
import React from 'react'

export const CANONICAL_MUSCLES = [
  'Pectorales',
  'Espalda',
  'Cuádriceps',
  'Isquiotibiales',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Core / Zona Media',
  'Glúteos',
  'Pantorrillas',
]

export function MuscleGroupMultiSelect({ selectedMuscles = [], onToggleMuscle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
        Grupos Musculares Afectados <span className="text-red-400 font-bold">*</span> (Selecciona al menos uno)
      </label>
      <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg max-h-36 overflow-y-auto">
        {CANONICAL_MUSCLES.map((muscle) => {
          const checked = selectedMuscles.includes(muscle)
          return (
            <label
              key={muscle}
              className="flex items-center gap-2 text-xs text-slate-300 p-1 rounded hover:bg-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleMuscle(muscle)}
                className="rounded bg-slate-900 border-slate-700 text-primary focus:ring-0 cursor-pointer"
              />
              <span>{muscle}</span>
            </label>
          )
        })}
      </div>
      {selectedMuscles.length > 0 && (
        <p className="text-[11px] text-slate-400 mt-1">
          Seleccionados: <span className="text-primary font-medium">{selectedMuscles.join(', ')}</span>
        </p>
      )}
    </div>
  )
}
