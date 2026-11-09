// Anchored to REQ-ALU-008
import { calcularEdad } from '../utils/calcularEdad'
import { calcularIMC } from '../utils/calcularIMC'
import { FichaMedicaImcCard } from './FichaMedicaImcCard'
import { FichaMedicaFreqCard } from './FichaMedicaFreqCard'

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
        <FichaMedicaImcCard imcInfo={imcInfo} />
      ) : (
        <FichaMedicaFreqCard cantidadDias={alumno.cantidad_dias_rutina} />
      )}
    </div>
  )
}
