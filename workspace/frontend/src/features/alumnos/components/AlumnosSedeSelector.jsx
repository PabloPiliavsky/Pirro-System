// Anchored to REQ-ALU-007

export function AlumnosSedeSelector({ gimnasios = [], selectedGimnasioId, onGimnasioChange }) {
  const sedesActivas = (gimnasios || []).filter((g) => g.estado)

  return (
    <select
      value={selectedGimnasioId}
      onChange={(e) => onGimnasioChange(e.target.value)}
      className="bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
    >
      <option value="ALL">Todas las sedes</option>
      <option value="NONE">Sin sede asignada</option>
      {sedesActivas.map((g) => (
        <option key={g.id} value={g.id}>
          {g.nombre}
        </option>
      ))}
    </select>
  )
}
