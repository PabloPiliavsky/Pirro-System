// Anchored to REQ-ALU-009
import { calcularEdad } from '../utils/calcularEdad'
import { calcularIMC } from '../utils/calcularIMC'
import { AlumnoPerfilMetricsGrid } from './AlumnoPerfilMetricsGrid'
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilBiometria({ perfil }) {
  const tieneImc = Boolean(perfil?.mostrar_imc)
  const imcInfo = tieneImc ? calcularIMC(perfil?.peso_kg, perfil?.altura_cm) : null

  return (
    <VStack className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Tu Ficha Física y Objetivos
      </h2>

      <AlumnoPerfilMetricsGrid perfil={perfil} tieneImc={tieneImc} imcInfo={imcInfo} />

      {perfil?.salud_enfermedades && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
          <span className="font-bold block mb-1">⚠️ Observaciones Médicas Registradas:</span>
          {perfil.salud_enfermedades}
        </div>
      )}

      {perfil?.comentario && (
        <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40 text-xs">
          <span className="font-bold text-muted-foreground block mb-1">
            Notas de tu profesor:
          </span>
          <p className="text-foreground leading-relaxed">{perfil.comentario}</p>
        </div>
      )}
    </VStack>
  )
}
