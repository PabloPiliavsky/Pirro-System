// Anchored to REQ-GYM-001
import { HStack } from '@/components/ui/HStack'

export function GimnasiosHeader({ onOpenCreate }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Sedes y Gimnasios</h1>
        <p className="text-sm text-slate-400 mt-1">
          Administra las sedes físicas y el parque de equipamiento disponible.
        </p>
      </div>
      <button
        onClick={onOpenCreate}
        className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-primary/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <span>+</span> Nueva Sede
      </button>
    </div>
  )
}
