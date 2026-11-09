// Anchored to REQ-ALU-002, REQ-ALU-004

export function AlumnoFormBasicFields({
  nombre, setNombre,
  apellido, setApellido,
  telefono, setTelefono,
  isEditing,
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Martín"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Apellido <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Ej: Gómez"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Teléfono Celular (WhatsApp)
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: +54 9 11 5555-0202"
          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </>
  )
}
