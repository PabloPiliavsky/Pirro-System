// Anchored to REQ-ALU-002, REQ-ALU-004

export function AlumnoFormBiometriaFields({
  alturaCm,
  setAlturaCm,
  pesoKg,
  setPesoKg,
  fechaNacimiento,
  setFechaNacimiento,
  fechaIngreso,
  setFechaIngreso,
}) {
  return (
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
  )
}
