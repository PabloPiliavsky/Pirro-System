// Anchored to REQ-ALU-007, REQ-ALU-008
import { calcularIMC } from '../utils/alumnoFormatters'

export function AlumnoCardMetrics({ alumno }) {
  const tieneImc = Boolean(alumno.mostrar_imc)
  const imcInfo = tieneImc ? calcularIMC(alumno.peso_kg, alumno.altura_cm) : null
  const gridLayout = tieneImc ? 'grid-cols-3' : 'grid-cols-2'
  const alturaDisplay = alumno.altura_cm ? `${alumno.altura_cm} cm` : '-'
  const pesoDisplay = alumno.peso_kg ? `${alumno.peso_kg} kg` : '-'
  const imcDisplay = imcInfo?.valor || '-'
  const imcColor = imcInfo?.color || 'text-muted-foreground'

  return (
    <div className={`grid ${gridLayout} gap-2 py-2.5 px-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-center mb-4`}>
      <div>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Altura</span>
        <span className="text-sm font-semibold text-white">{alturaDisplay}</span>
      </div>
      <div>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Peso</span>
        <span className="text-sm font-semibold text-white">{pesoDisplay}</span>
      </div>
      {tieneImc && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">IMC</span>
          <span className={`text-sm font-semibold ${imcColor}`}>{imcDisplay}</span>
        </div>
      )}
    </div>
  )
}
