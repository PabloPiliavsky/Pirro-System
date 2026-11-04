// Anchored to REQ-GYM-002, REQ-GYM-005, REQ-GYM-006
import React, { useState } from 'react'
import { EquipamientoSelector } from './EquipamientoSelector'

export function GimnasioFormModal({
  gimnasio,
  equipamientoList,
  onClose,
  onSave,
  onCreateEquipamiento,
}) {
  const [nombre, setNombre] = useState(gimnasio?.nombre || '')
  const [direccion, setDireccion] = useState(gimnasio?.direccion || '')
  const [horarioApertura, setHorarioApertura] = useState(gimnasio?.horario_apertura || '08:00')
  const [horarioCierre, setHorarioCierre] = useState(gimnasio?.horario_cierre || '22:00')
  const [estado, setEstado] = useState(gimnasio?.estado !== undefined ? gimnasio.estado : true)

  const initialSelected = (gimnasio?.equipamiento_disponible || []).map((e) => e.id_equipamiento)
  const [selectedEq, setSelectedEq] = useState(initialSelected)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const toggleEq = (id) => {
    setSelectedEq((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isFormValid = Boolean(nombre.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) {
      setErrorMsg('El nombre de la sede es obligatorio')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const payload = {
      ...(gimnasio?.id ? { id: gimnasio.id } : {}),
      nombre: nombre.trim(),
      direccion: direccion.trim() || null,
      horario_apertura: horarioApertura || null,
      horario_cierre: horarioCierre || null,
      estado,
      equipamientoIds: selectedEq,
    }

    const res = await onSave(payload)
    setSubmitting(false)

    if (res.ok) {
      onClose()
    } else {
      setErrorMsg(res.error?.message || 'Error al guardar la sede')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {gimnasio ? 'Editar Sede' : 'Nueva Sede'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
          <p className="text-[11px] text-slate-400">
            Los campos marcados con <span className="text-red-400 font-bold">*</span> son obligatorios.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nombre de la sede <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Sede Central"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Corrientes 1234"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Apertura (HH:MM)
              </label>
              <input
                type="text"
                value={horarioApertura}
                onChange={(e) => setHorarioApertura(e.target.value)}
                placeholder="08:00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Cierre (HH:MM)
              </label>
              <input
                type="text"
                value={horarioCierre}
                onChange={(e) => setHorarioCierre(e.target.value)}
                placeholder="22:00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gymEstado"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
            />
            <label htmlFor="gymEstado" className="text-sm text-slate-300 cursor-pointer">
              Sede activa / operativa
            </label>
          </div>

          <EquipamientoSelector
            equipamientoList={equipamientoList}
            selectedEq={selectedEq}
            onToggleEq={toggleEq}
            onCreateEquipamiento={onCreateEquipamiento}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition cursor-pointer shadow-md shadow-primary/20"
            >
              {submitting ? 'Guardando...' : 'Guardar Sede'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
