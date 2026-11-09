// Anchored to REQ-ALU-008

export function FichaMedicaFreqCard({ cantidadDias }) {
  return (
    <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Frecuencia</span>
      <span className="text-lg font-bold text-foreground">
        {cantidadDias} días/sem
      </span>
      <span className="block text-[10px] text-muted-foreground mt-0.5 font-medium">
        IMC oculto
      </span>
    </div>
  )
}
