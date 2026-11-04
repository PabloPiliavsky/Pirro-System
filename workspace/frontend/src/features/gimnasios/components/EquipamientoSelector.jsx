// Anchored to REQ-GYM-002, REQ-GYM-005
import { useState } from 'react'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { NewEquipamientoInlineForm } from './NewEquipamientoInlineForm'
import { EquipamientoCheckboxList } from './EquipamientoCheckboxList'

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
    <VStack>
      <HStack justify="between" className="mb-2">
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
      </HStack>

      {showNewEqInput && (
        <NewEquipamientoInlineForm
          newEqName={newEqName}
          onNameChange={setNewEqName}
          onCreate={handleCreate}
          creatingEq={creatingEq}
        />
      )}

      <EquipamientoCheckboxList
        equipamientoList={equipamientoList}
        selectedEq={selectedEq}
        onToggleEq={onToggleEq}
      />
    </VStack>
  )
}
