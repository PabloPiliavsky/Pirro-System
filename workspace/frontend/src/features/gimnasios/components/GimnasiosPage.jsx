// Anchored to REQ-GYM-001, REQ-GYM-006
import { useState } from 'react'
import { useGimnasios } from '../hooks/useGimnasios'
import { GimnasiosHeader } from './GimnasiosHeader'
import { GimnasiosFilterBar } from './GimnasiosFilterBar'
import { GimnasiosGrid } from './GimnasiosGrid'
import { GimnasioFormModal } from './GimnasioFormModal'
import { VStack } from '@/components/ui/VStack'

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
    <VStack className="gap-6">
      <GimnasiosHeader onOpenCreate={openCreate} />

      <GimnasiosFilterBar
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        totalCount={rawGimnasios.length}
        activeCount={totalActivos}
        inactiveCount={totalInactivos}
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <GimnasiosGrid
        gimnasios={gimnasios}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
      />

      {modalOpen && (
        <GimnasioFormModal
          gimnasio={selectedGym}
          equipamientoList={equipamiento}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onCreateEquipamiento={handleCreateEquipamiento}
        />
      )}
    </VStack>
  )
}
