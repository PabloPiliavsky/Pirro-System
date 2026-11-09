// Anchored to REQ-RUT-002, REQ-RUT-008

export function ConstructorDiasTabs({
  cantidadDias = 3,
  diaActivo = 1,
  onSeleccionarDia,
  rutinasSemana = [],
}) {
  const dias = Array.from({ length: cantidadDias }, (_, idx) => idx + 1)

  const getEjerciciosCount = (numDia) => {
    const rutina = rutinasSemana.find((r) => Number(r.numero_dia) === numDia)
    return rutina?.ejercicios?.length || 0
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {dias.map((dia) => {
        const isActive = dia === diaActivo
        const count = getEjerciciosCount(dia)

        return (
          <button
            key={dia}
            type="button"
            onClick={() => onSeleccionarDia(dia)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer select-none active:scale-95 ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                : 'bg-card/70 hover:bg-secondary text-muted-foreground hover:text-foreground border-border'
            }`}
          >
            <span>Día {dia}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {count} {count === 1 ? 'ej' : 'ejs'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ConstructorDiasTabs
