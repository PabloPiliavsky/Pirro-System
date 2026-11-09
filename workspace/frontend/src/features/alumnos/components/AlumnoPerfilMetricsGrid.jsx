// Anchored to REQ-ALU-009

export function AlumnoPerfilMetricsGrid({ perfil, tieneImc, imcInfo }) {
  return (
    <div className={`grid ${tieneImc ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-3 text-center`}>
      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Altura</span>
        <span className="text-lg font-bold text-foreground">
          {perfil?.altura_cm ? `${perfil.altura_cm} cm` : '-'}
        </span>
      </div>

      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Peso</span>
        <span className="text-lg font-bold text-foreground">
          {perfil?.peso_kg ? `${perfil.peso_kg} kg` : '-'}
        </span>
      </div>

      {tieneImc && (
        <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">IMC Estimado</span>
          <span className={`text-lg font-bold ${imcInfo?.color || 'text-foreground'}`}>
            {imcInfo?.valor || '-'}
          </span>
        </div>
      )}

      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Frecuencia</span>
        <span className="text-lg font-bold text-foreground">
          {perfil?.cantidad_dias_rutina || 3} días/sem
        </span>
      </div>
    </div>
  )
}
