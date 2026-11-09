// Anchored to REQ-ALU-007, REQ-ALU-008
import { calcularIMC } from '../utils/alumnoFormatters'

export function AlumnoCardMetrics({ alumno }) {
  const tieneImc = Boolean(alumno.mostrar_imc)
  const imcInfo = tieneImc ? calcularIMC(alumno.peso_kg, alumno.altura_cm) : null

  return (
    <div
      className={`grid ${
        tieneImc ? 'grid-cols-3' : 'grid-cols-2'
      } gap-2 py-2.5 px-3 bg-secondary/50 rounded-lg border border-border/40 text-center mb-4`}
    >
      <div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Altura</span>
        <span className="text-sm font-semibold text-foreground">
          {alumno.altura_cm ? `${alumno.altura_cm} cm` : '-'}
        </span>
      </div>
      <div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Peso</span>
        <span className="text-sm font-semibold text-foreground">
          {alumno.peso_kg ? `${alumno.peso_kg} kg` : '-'}
        </span>
      </div>
      {tieneImc && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">IMC</span>
          <span className={`text-sm font-semibold ${imcInfo?.color || 'text-muted-foreground'}`}>
            {imcInfo?.valor || '-'}
          </span>
        </div>
      )}
    </div>
  )
}
