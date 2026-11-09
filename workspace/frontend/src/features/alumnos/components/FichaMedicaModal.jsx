// Anchored to REQ-ALU-008
import { FichaMedicaHeader } from './FichaMedicaHeader'
import { FichaMedicaAlert } from './FichaMedicaAlert'
import { FichaMedicaBiometria } from './FichaMedicaBiometria'
import { FichaMedicaNotas } from './FichaMedicaNotas'
import { VStack } from '@/components/ui/VStack'
import { HStack } from '@/components/ui/HStack'

export function FichaMedicaModal({ alumno, onClose }) {
  if (!alumno) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <VStack className="bg-card border border-border rounded-2xl w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
        <FichaMedicaHeader alumno={alumno} onClose={onClose} />
        <FichaMedicaAlert saludEnfermedades={alumno.salud_enfermedades} />
        <FichaMedicaBiometria alumno={alumno} />
        <FichaMedicaNotas alumno={alumno} />

        <HStack justify="end" className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm transition-all cursor-pointer active:scale-95"
          >
            Cerrar Ficha
          </button>
        </HStack>
      </VStack>
    </div>
  )
}

export default FichaMedicaModal
