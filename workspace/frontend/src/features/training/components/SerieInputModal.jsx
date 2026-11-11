// Anchored to REQ-TRN-004, REQ-TRN-005, REQ-TRN-010, REQ-TRN-012
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { SerieModalFormFields } from './SerieModalFormFields'
import { X, Check } from 'lucide-react'

export function SerieInputModal({ isOpen, onClose, item, numeroSerie, initialSerie, onSave }) {
  const [reps, setReps] = useState(10)
  const [peso, setPeso] = useState(0)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    if (initialSerie) {
      setReps(initialSerie.repeticionesRealizadas)
      setPeso(initialSerie.pesoUtilizado)
      setComentario(initialSerie.comentarioAlumno || '')
    } else {
      const match = item?.repeticiones_objetivo?.match(/\d+/)
      setReps(match ? Number(match[0]) : 10)
      setPeso(0)
      setComentario('')
    }
  }, [initialSerie, item, numeroSerie])

  if (!isOpen || !item) return null

  const handleConfirm = (e) => {
    e.preventDefault()
    onSave({
      idEjercicio: item.id_ejercicio,
      numeroSerie,
      repeticionesObjetivo: item.repeticiones_objetivo,
      repeticionesRealizadas: Number(reps),
      pesoUtilizado: Number(peso),
      comentarioAlumno: comentario.trim() || null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in fade-in zoom-in-95">
        <form onSubmit={handleConfirm}>
          <VStack className="gap-4">
            <HStack justify="between" align="start">
              <VStack className="gap-0.5">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Serie {numeroSerie} de {item.series_objetivo}
                </span>
                <span className="text-base font-black text-foreground">
                  {item.ejercicio?.nombre}
                </span>
                <span className="text-xs text-muted-foreground">
                  Objetivo: {item.repeticiones_objetivo} reps
                </span>
              </VStack>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </HStack>

            <SerieModalFormFields
              reps={reps}
              setReps={setReps}
              peso={peso}
              setPeso={setPeso}
              comentario={comentario}
              setComentario={setComentario}
            />

            <HStack className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 min-h-11 rounded-xl cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 min-h-11 rounded-xl font-bold gap-1.5 cursor-pointer"
              >
                <Check className="size-4" />
                Confirmar
              </Button>
            </HStack>
          </VStack>
        </form>
      </div>
    </div>
  )
}
