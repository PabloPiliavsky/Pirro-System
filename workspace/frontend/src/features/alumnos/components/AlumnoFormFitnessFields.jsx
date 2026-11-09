// Anchored to REQ-ALU-002, REQ-ALU-004
import { VStack } from '@/components/ui/VStack'
import { AlumnoFormSedeFields } from './AlumnoFormSedeFields'
import { AlumnoFormBiometriaFields } from './AlumnoFormBiometriaFields'
import { AlumnoFormImcToggle } from './AlumnoFormImcToggle'

export function AlumnoFormFitnessFields({
  gimnasios,
  idGimnasio, setIdGimnasio,
  cantidadDiasRutina, setCantidadDiasRutina,
  alturaCm, setAlturaCm,
  pesoKg, setPesoKg,
  fechaNacimiento, setFechaNacimiento,
  fechaIngreso, setFechaIngreso,
  mostrarImc, setMostrarImc,
}) {
  return (
    <VStack className="space-y-3 pt-3 border-t border-border/40">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
        2. Sede y Datos Antropométricos
      </h3>
      <AlumnoFormSedeFields
        gimnasios={gimnasios}
        idGimnasio={idGimnasio}
        setIdGimnasio={setIdGimnasio}
        cantidadDiasRutina={cantidadDiasRutina}
        setCantidadDiasRutina={setCantidadDiasRutina}
      />
      <AlumnoFormBiometriaFields
        alturaCm={alturaCm}
        setAlturaCm={setAlturaCm}
        pesoKg={pesoKg}
        setPesoKg={setPesoKg}
        fechaNacimiento={fechaNacimiento}
        setFechaNacimiento={setFechaNacimiento}
        fechaIngreso={fechaIngreso}
        setFechaIngreso={setFechaIngreso}
      />
      <AlumnoFormImcToggle
        mostrarImc={mostrarImc}
        setMostrarImc={setMostrarImc}
      />
    </VStack>
  )
}
