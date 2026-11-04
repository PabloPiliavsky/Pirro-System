// Anchored to REQ-GYM-002, REQ-GYM-005
import React, { useState } from 'react'

export function EquipamientoSelector({
  equipamientoList = [],
  selectedEq = [],
  onToggleEq,
  onCreateEquipamiento,
}) {
  const [showNewEqInput, setShowNewEqInput] = useState(false)
  const [newEqName, setNewEqName] = useState('')
  const [creatingEq, setCreatingEq] = useState(false)

  const handleCreate = async () => {
    if (!newEqName.trim() || !onCreateEquipamiento) return
    setCreatingEq(true)
    const res = await onCreateEquipamiento({
      nombre: newEqName.trim(),
      categoria: 'maquina',
    })
    setCreatingEq(false)
    if (res.ok && res.data) {
      onToggleEq(res.data.id)
      setNewEqName('')
      setShowNewEqInput(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-slate-300 uppercase">
          Equipamiento Disponible
        </label>
        <button
          type="button"
          onClick={() => setShowNewEqInput((prev) => !prev)}
          className="text-xs text-primary hover:text-primary-hover font-medium transition cursor-pointer"
        >
          {showNewEqInput ? 'Cancelar' : '+ Agregar nuevo equipamiento'}
        </button>
      </div>

      {showNewEqInput && (
        <div className="p-3 mb-2 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2">
          <input
            type="text"
            value={newEqName}
            onChange={(e) => setNewEqName(e.target.value)}
            placeholder="Nombre de la nueva máquina o accesorio..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newEqName.trim() || creatingEq}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            {creatingEq ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
        {equipamientoList.map((eq) => {
          const checked = selectedEq.includes(eq.id)
          return (
            <label
              key={eq.id}
              className="flex items-center gap-2 text-xs text-slate-300 p-1.5 rounded hover:bg-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleEq(eq.id)}
                className="rounded bg-slate-900 border-slate-700 text-primary focus:ring-0 cursor-pointer"
              />
              <span>{eq.nombre}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
