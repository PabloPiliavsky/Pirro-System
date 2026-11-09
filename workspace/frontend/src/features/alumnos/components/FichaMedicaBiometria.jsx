// Anchored to REQ-ALU-008
import { calcularEdad, calcularIMC } from '../utils/alumnoFormatters'

export function FichaMedicaBiometria({ alumno }) {
  const edad = calcularEdad(alumno.fecha_nacimiento)
  const tieneImc = Boolean(alumno.mostrar_imc)
  const imcInfo = tieneImc ? calcularIMC(alumno.peso_kg, alumno.altura_cm) : null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Edad</span>
        <span className="text-lg font-bold text-foreground">
          {edad !== null ? `${edad} años` : '-'}
        </span>
      </div>

      <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Altura</span>
        <span className="text-lg font-bold text-foreground">
          {alumno.altura_cm ? `${alumno.altura_cm} cm` : '-'}
        </span>
      </div>

      <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Peso</span>
        <span className="text-lg font-bold text-foreground">
          {alumno.peso_kg ? `${alumno.peso_kg} kg` : '-'}
        </span>
      </div>

      {tieneImc ? (
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
      ) : (
        <div className="p-3 bg-secondary/40 rounded-xl border border-border/40 text-center">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Frecuencia</span>
          <span className="text-lg font-bold text-foreground">
            {alumno.cantidad_dias_rutina || 3} días/sem
          </span>
          <span className="block text-[10px] text-muted-foreground mt-0.5 font-medium">
            IMC oculto
          </span>
        </div>
      )}
    </div>
  )
}
