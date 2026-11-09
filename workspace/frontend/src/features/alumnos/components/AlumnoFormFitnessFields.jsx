// Anchored to REQ-ALU-002, REQ-ALU-004
import { VStack } from '@/components/ui/VStack'

export function AlumnoFormFitnessFields({
  gimnasios,
  idGimnasio, setIdGimnasio,
  cantidadDiasRutina, setCantidadDiasRutina,
  alturaCm, setAlturaCm,
  pesoKg, setPesoKg,
  fechaNacimiento, setFechaNacimiento,
  fechaIngreso, setFechaIngreso,
  mostrarImc, setMostrarImc,
}) {
  const sedesActivas = (gimnasios || []).filter((g) => g.estado)

  return (
    <VStack className="space-y-3 pt-3 border-t border-border/40">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
        2. Sede y Datos Antropométricos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Gimnasio / Sede Asignada (Opcional)
          </label>
          <select
            value={idGimnasio}
            onChange={(e) => setIdGimnasio(e.target.value)}
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Sin sede asignada</option>
            {sedesActivas.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Frecuencia Semanal (Días de Rutina)
          </label>
          <select
            value={cantidadDiasRutina}
            onChange={(e) => setCantidadDiasRutina(e.target.value)}
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'día por semana' : 'días por semana'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={alturaCm}
            onChange={(e) => setAlturaCm(e.target.value)}
            placeholder="Ej: 178"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={pesoKg}
            onChange={(e) => setPesoKg(e.target.value)}
            placeholder="Ej: 79.5"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            F. Nacimiento
          </label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full bg-secondary/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            F. Ingreso
          </label>
          <input
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
            className="w-full bg-secondary/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          />
        </div>
      </div>

      <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-start gap-3">
        <input
          id="toggleMostrarImc"
          type="checkbox"
          checked={mostrarImc}
          onChange={(e) => setMostrarImc(e.target.checked)}
          className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
        />
        <label htmlFor="toggleMostrarImc" className="text-xs text-foreground cursor-pointer select-none">
          <span className="font-semibold block">Habilitar visualización de IMC al alumno</span>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
            Por defecto permanece oculto. Activá esta opción sólo si el alumno te solicitó explícitamente ver su IMC estimado en su ficha.
          </span>
        </label>
      </div>
    </VStack>
  )
}
