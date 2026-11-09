// Anchored to REQ-ALU-002, REQ-ALU-004

export function AlumnoFormAccountFields({
  isEditing,
  email, setEmail,
  nombreUsuario, setNombreUsuario,
  password, setPassword,
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Nombre de Usuario (DNI / Alias) {!isEditing && <span className="text-red-400">*</span>}
          </label>
          <input
            type="text"
            required={!isEditing}
            disabled={isEditing}
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Ej: 38456123 o martin.gomez"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Correo Electrónico {!isEditing && <span className="text-red-400">*</span>}
          </label>
          <input
            type="email"
            required={!isEditing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alumno@ejemplo.com"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      {!isEditing && (
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Contraseña Inicial
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Pirro123!"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Sugerida por defecto: Pirro123!
          </span>
        </div>
      )}
    </>
  )
}
