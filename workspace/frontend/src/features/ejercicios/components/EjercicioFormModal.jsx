// Anchored to REQ-EJE-002, REQ-EJE-003, REQ-EJE-006
import React, { useState } from 'react'
import { MuscleGroupMultiSelect } from './MuscleGroupMultiSelect'

export function EjercicioFormModal({ ejercicio, equipamientoList, onClose, onSave }) {
  const [nombre, setNombre] = useState(ejercicio?.nombre || '')

  const initialMuscles = ejercicio?.grupo_muscular
    ? ejercicio.grupo_muscular.split(/[,/]/).map((m) => m.trim()).filter(Boolean)
    : ['Pectorales']

  const [selectedMuscles, setSelectedMuscles] = useState(initialMuscles)
  const [requiereEq, setRequiereEq] = useState(Boolean(ejercicio?.requiere_equipamiento))
  const [idEqRequerido, setIdEqRequerido] = useState(ejercicio?.id_equipamiento_requerido || '')
  const [indicaciones, setIndicaciones] = useState(ejercicio?.indicaciones || '')
  const [urlVideo, setUrlVideo] = useState(ejercicio?.url_video || '')
  const [estado, setEstado] = useState(ejercicio?.estado !== undefined ? ejercicio.estado : true)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const toggleMuscle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    )
  }

  const isFormValid =
    Boolean(nombre.trim()) &&
    selectedMuscles.length > 0 &&
    (!requiereEq || Boolean(idEqRequerido))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrorMsg('El nombre del ejercicio es obligatorio')
      return
    }
    if (selectedMuscles.length === 0) {
      setErrorMsg('Debes seleccionar al menos un grupo muscular')
      return
    }
    if (requiereEq && !idEqRequerido) {
      setErrorMsg('Debes seleccionar el equipamiento requerido')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const payload = {
      ...(ejercicio?.id ? { id: ejercicio.id } : {}),
      nombre: nombre.trim(),
      grupo_muscular: selectedMuscles.join(', '),
      requiere_equipamiento: requiereEq,
      id_equipamiento_requerido: requiereEq ? Number(idEqRequerido) : null,
      indicaciones: indicaciones.trim() || null,
      url_video: urlVideo.trim() || null,
      estado,
    }

    const res = await onSave(payload)
    setSubmitting(false)

    if (res.ok) {
      onClose()
    } else {
      setErrorMsg(res.error?.message || 'Error al guardar el ejercicio')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {ejercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
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
              Nombre del ejercicio <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Press de Banca Plano"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <MuscleGroupMultiSelect
            selectedMuscles={selectedMuscles}
            onToggleMuscle={toggleMuscle}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiereEq"
              checked={requiereEq}
              onChange={(e) => {
                setRequiereEq(e.target.checked)
                if (!e.target.checked) setIdEqRequerido('')
              }}
              className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
            />
            <label htmlFor="requiereEq" className="text-sm text-slate-300 cursor-pointer">
              ¿Requiere máquina o equipamiento específico?
            </label>
          </div>

          {requiereEq && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Equipamiento Requerido <span className="text-red-400 font-bold">*</span>
              </label>
              <select
                value={idEqRequerido}
                onChange={(e) => setIdEqRequerido(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
                required
              >
                <option value="">-- Seleccionar máquina/equipo --</option>
                {equipamientoList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Indicaciones Técnicas
            </label>
            <textarea
              rows={3}
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
              placeholder="Ej: Mantener retracción escapular y no bloquear codos arriba."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Enlace de Video (URL demostrativa)
            </label>
            <input
              type="url"
              value={urlVideo}
              onChange={(e) => setUrlVideo(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ejercicioEstado"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 cursor-pointer"
            />
            <label htmlFor="ejercicioEstado" className="text-sm text-slate-300 cursor-pointer">
              Ejercicio activo en el catálogo
            </label>
          </div>

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
              {submitting ? 'Guardando...' : 'Guardar Ejercicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
