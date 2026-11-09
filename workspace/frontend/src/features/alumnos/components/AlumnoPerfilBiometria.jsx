// Anchored to REQ-ALU-009
import { calcularEdad, calcularIMC } from '../utils/alumnoFormatters'
import { VStack } from '@/components/ui/VStack'

export function AlumnoPerfilBiometria({ perfil }) {
  const edad = calcularEdad(perfil?.fecha_nacimiento || perfil?.persona?.fecha_nacimiento)
  const tieneImc = Boolean(perfil?.mostrar_imc)
  const imcInfo = tieneImc ? calcularIMC(perfil?.peso_kg, perfil?.altura_cm) : null

  return (
    <VStack className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Tu Ficha Física y Objetivos
      </h2>

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
