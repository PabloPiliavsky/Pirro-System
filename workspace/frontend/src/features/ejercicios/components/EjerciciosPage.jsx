// Anchored to REQ-EJE-001, REQ-EJE-006
import React, { useState } from 'react'
import { useEjercicios } from '../hooks/useEjercicios'
import { EjercicioCard } from './EjercicioCard'
import { EjercicioFormModal } from './EjercicioFormModal'

export function EjerciciosPage() {
  const {
    ejercicios,
    rawEjercicios,
    equipamiento,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMuscles,
    toggleMuscleFilter,
    muscleGroups,
    handleSave,
    handleDelete,
  } = useEjercicios()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEjercicio, setSelectedEjercicio] = useState(null)

  const openCreate = () => {
    setSelectedEjercicio(null)
    setModalOpen(true)
  }

  const openEdit = (ej) => {
    setSelectedEjercicio(ej)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Catálogo de Ejercicios</h1>
          <p className="text-sm text-slate-400 mt-1">
            Biblioteca de movimientos, grupos musculares y requerimientos de máquinas.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-primary/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>+</span> Nuevo Ejercicio
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o indicación..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {muscleGroups.map((group) => {
            const isTodos = group === 'TODOS'
            const active = isTodos
              ? selectedMuscles.length === 0
              : selectedMuscles.includes(group)

            return (
              <button
                key={group}
                type="button"
                onClick={() => toggleMuscleFilter(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {group}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Cargando catálogo de ejercicios...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ejercicios.map((ej) => (
            <EjercicioCard
              key={ej.id}
              ejercicio={ej}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
          {ejercicios.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 text-sm">
              No se encontraron ejercicios con los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <EjercicioFormModal
          ejercicio={selectedEjercicio}
          equipamientoList={equipamiento}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
