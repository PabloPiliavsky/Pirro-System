// Anchored to REQ-EJE-001, REQ-EJE-006
import { useState } from 'react'
import { useEjercicios } from '../hooks/useEjercicios'
import { EjerciciosHeader } from './EjerciciosHeader'
import { EjerciciosSearchBar } from './EjerciciosSearchBar'
import { EjerciciosGrid } from './EjerciciosGrid'
import { EjercicioFormModal } from './EjercicioFormModal'
import { VStack } from '@/components/ui/VStack'

export function EjerciciosPage() {
  const {
    ejercicios,
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
    <VStack className="gap-6">
      <EjerciciosHeader onOpenCreate={openCreate} />

      <EjerciciosSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        muscleGroups={muscleGroups}
        selectedMuscles={selectedMuscles}
        onToggleMuscleFilter={toggleMuscleFilter}
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <EjerciciosGrid
        ejercicios={ejercicios}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <EjercicioFormModal
          ejercicio={selectedEjercicio}
          equipamientoList={equipamiento}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </VStack>
  )
}

export default EjerciciosPage
