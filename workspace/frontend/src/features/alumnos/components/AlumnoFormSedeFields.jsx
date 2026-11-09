// Anchored to REQ-ALU-002, REQ-ALU-004

export function AlumnoFormSedeFields({
  gimnasios = [],
  idGimnasio,
  setIdGimnasio,
  cantidadDiasRutina,
  setCantidadDiasRutina,
}) {
  const sedesActivas = (gimnasios || []).filter((g) => g.estado)

  return (
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
  )
}
