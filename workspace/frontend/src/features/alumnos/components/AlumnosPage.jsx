// Anchored to REQ-ALU-001, REQ-ALU-006, REQ-ALU-007
import { useState } from 'react'
import { useAlumnos } from '../hooks/useAlumnos'
import { AlumnosPageHeader } from './AlumnosPageHeader'
import { AlumnosFilterBar } from './AlumnosFilterBar'
import { AlumnosPageGrid } from './AlumnosPageGrid'
import { AlumnosModals } from './AlumnosModals'
import { VStack } from '@/components/ui/VStack'

export function AlumnosPage() {
  const {
    alumnos,
    filteredAlumnos,
    gimnasios,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedGimnasioId,
    setSelectedGimnasioId,
    statusFilter,
    setStatusFilter,
    handleCreate,
    handleUpdate,
    handleToggleEstado,
  } = useAlumnos()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAlumno, setEditingAlumno] = useState(null)
  const [viewingFichaAlumno, setViewingFichaAlumno] = useState(null)
  const [bajaTargetAlumno, setBajaTargetAlumno] = useState(null)
  const [bajaSubmitting, setBajaSubmitting] = useState(false)

  const handleConfirmarBaja = async (idPersona) => {
    setBajaSubmitting(true)
    await handleToggleEstado(idPersona, false)
    setBajaSubmitting(false)
    setBajaTargetAlumno(null)
  }

  return (
    <VStack className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <AlumnosPageHeader
        totalCount={alumnos.length}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <AlumnosFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        gimnasios={gimnasios}
        selectedGimnasioId={selectedGimnasioId}
        onGimnasioChange={setSelectedGimnasioId}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <AlumnosPageGrid
        loading={loading}
        error={error}
        alumnos={filteredAlumnos}
        onVerFicha={(al) => setViewingFichaAlumno(al)}
        onEdit={(al) => setEditingAlumno(al)}
        onSolicitarBaja={(al) => setBajaTargetAlumno(al)}
        onReactivar={(id) => handleToggleEstado(id, true)}
      />

      <AlumnosModals
        isCreateOpen={isCreateOpen}
        editingAlumno={editingAlumno}
        viewingFichaAlumno={viewingFichaAlumno}
        bajaTargetAlumno={bajaTargetAlumno}
        bajaSubmitting={bajaSubmitting}
        gimnasios={gimnasios}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setEditingAlumno(null)}
        onCloseFicha={() => setViewingFichaAlumno(null)}
        onCloseBaja={() => setBajaTargetAlumno(null)}
        onSaveCreate={handleCreate}
        onSaveEdit={handleUpdate}
        onConfirmBaja={handleConfirmarBaja}
      />
    </VStack>
  )
}

export default AlumnosPage
