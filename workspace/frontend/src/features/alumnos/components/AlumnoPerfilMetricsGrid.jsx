// Anchored to REQ-ALU-009

export function AlumnoPerfilMetricsGrid({ perfil, tieneImc, imcInfo }) {
  const gridLayout = tieneImc ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
  const alturaDisplay = perfil?.altura_cm ? `${perfil.altura_cm} cm` : '-'
  const pesoDisplay = perfil?.peso_kg ? `${perfil.peso_kg} kg` : '-'
  const imcDisplay = imcInfo?.valor || '-'
  const imcColor = imcInfo?.color || 'text-foreground'
  const frecuenciaDisplay = `${perfil.cantidad_dias_rutina} días/sem`

  return (
    <div className={`grid ${gridLayout} gap-3 text-center`}>
      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Altura</span>
        <span className="text-lg font-bold text-foreground">{alturaDisplay}</span>
      </div>

      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Peso</span>
        <span className="text-lg font-bold text-foreground">{pesoDisplay}</span>
      </div>

      {tieneImc && (
        <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">IMC Estimado</span>
          <span className={`text-lg font-bold ${imcColor}`}>{imcDisplay}</span>
        </div>
      )}

      <div className="p-3 bg-secondary/50 rounded-xl border border-border/40">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Frecuencia</span>
        <span className="text-lg font-bold text-foreground">{frecuenciaDisplay}</span>
      </div>
    </div>
  )
}
