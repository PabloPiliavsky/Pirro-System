// Anchored to REQ-ALU-008

export function FichaMedicaImcCard({ imcInfo }) {
  return (
    <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
      <span className="text-[10px] uppercase font-bold text-muted-foreground block">IMC Estimado</span>
      <span className={`text-lg font-bold ${imcInfo?.color || 'text-foreground'}`}>
        {imcInfo?.valor || '-'}
      </span>
      {imcInfo && (
        <span className="block text-[10px] text-muted-foreground mt-0.5 font-medium">
          {imcInfo.categoria}
        </span>
      )}
    </div>
  )
}
