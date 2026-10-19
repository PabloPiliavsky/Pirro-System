// Anchored to REQ-GYM-001, REQ-GYM-006
import React, { useState } from 'react'
import { useGimnasios } from '../hooks/useGimnasios'
import { GimnasioCard } from './GimnasioCard'
import { GimnasioFormModal } from './GimnasioFormModal'

export function GimnasiosPage() {
  const {
    gimnasios,
    rawGimnasios,
    equipamiento,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    handleSave,
    handleDelete,
    handleReactivate,
    handleCreateEquipamiento,
  } = useGimnasios()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGym, setSelectedGym] = useState(null)

  const openCreate = () => {
    setSelectedGym(null)
    setModalOpen(true)
  }

  const openEdit = (gym) => {
    setSelectedGym(gym)
    setModalOpen(true)
  }

  const totalActivos = rawGimnasios.filter((g) => g.estado).length
  const totalInactivos = rawGimnasios.filter((g) => !g.estado).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Sedes y Gimnasios</h1>
          <p className="text-sm text-slate-400 mt-1">
            Administra las sedes físicas y el parque de equipamiento disponible.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-primary/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>+</span> Nueva Sede
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
          Filtrar:
        </span>
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todas ({rawGimnasios.length})
        </button>
        <button
          onClick={() => setFilterStatus('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            filterStatus === 'ACTIVE'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Dadas de alta ({totalActivos})
        </button>
        <button
          onClick={() => setFilterStatus('INACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            filterStatus === 'INACTIVE'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Dadas de baja ({totalInactivos})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Cargando sedes y equipamiento...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gimnasios.map((gym) => (
            <GimnasioCard
              key={gym.id}
              gimnasio={gym}
              onEdit={openEdit}
              onDelete={handleDelete}
              onReactivate={handleReactivate}
            />
          ))}
          {gimnasios.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 text-sm">
              No hay gimnasios para el filtro seleccionado.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <GimnasioFormModal
          gimnasio={selectedGym}
          equipamientoList={equipamiento}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onCreateEquipamiento={handleCreateEquipamiento}
        />
      )}
    </div>
  )
}
