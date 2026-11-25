// Anchored to REQ-PRG-002, REQ-PRG-003, REQ-PRG-012
import { UserCheck, Building2, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import { AlumnoCustomDropdown } from './AlumnoCustomDropdown'

export function ProgresoAlumnoSelector({
  alumnos,
  selectedAlumnoId,
  onSelectAlumno,
  includeInactivos,
  onToggleInactivos,
  alumnoActual,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <VStack className="gap-3.5">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
          <div className="lg:col-span-6 w-full">
            <label
              htmlFor="select-alumno-progreso"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
            >
              Alumno a Consultar
            </label>
            <AlumnoCustomDropdown
              alumnos={alumnos}
              selectedAlumnoId={selectedAlumnoId}
              onSelectAlumno={onSelectAlumno}
            />
          </div>

          <div className="lg:col-span-6 flex items-center justify-center lg:pt-5">
            <label className="inline-flex items-center justify-center gap-2.5 cursor-pointer rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-primary/60 transition shadow-sm">
              <input
                type="checkbox"
                checked={includeInactivos}
                onChange={(e) => onToggleInactivos(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
              <span>¿Incluir alumnos dados de baja (inactivos)?</span>
            </label>
          </div>
        </div>

        {alumnoActual && (
          <HStack align="center" className="flex-wrap gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
            <Badge variant={alumnoActual.estado ? 'default' : 'secondary'} className="gap-1">
              <UserCheck className="size-3" />
              {alumnoActual.estado ? 'Alumno Activo' : 'Alumno Inactivo'}
            </Badge>
            {alumnoActual.gimnasio && (
              <Badge variant="outline" className="gap-1 border-slate-700 bg-slate-800/70 text-slate-200">
                <Building2 className="size-3 text-primary" />
                {alumnoActual.gimnasio.nombre}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 border-primary/25 bg-primary/10 text-primary font-bold">
              <Calendar className="size-3 text-primary" />
              {alumnoActual.cantidad_dias_rutina} días/sem
            </Badge>
            <span className="text-slate-400">
              Altura: <strong className="text-slate-200">{alumnoActual.altura_cm} cm</strong> · Peso:{' '}
              <strong className="text-slate-200">{alumnoActual.peso_kg} kg</strong>
            </span>
          </HStack>
        )}
      </VStack>
    </div>
  )
}
