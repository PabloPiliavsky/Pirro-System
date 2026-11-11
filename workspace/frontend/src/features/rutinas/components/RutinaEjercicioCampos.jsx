// Anchored to REQ-RUT-005, REQ-RUT-008

export function RutinaEjercicioCampos({ item, index, onActualizar }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-w-lg">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase">Series</label>
        <input
          type="number"
          min="1"
          max="20"
          value={item.series_objetivo}
          onChange={(e) => onActualizar(index, 'series_objetivo', Number(e.target.value))}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase">Repeticiones</label>
        <input
          type="text"
          value={item.repeticiones_objetivo}
          onChange={(e) => onActualizar(index, 'repeticiones_objetivo', e.target.value)}
          placeholder="10-12"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:border-primary focus:outline-none"
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">Notas / Tempo</label>
        <input
          type="text"
          value={item.notas_profesor || ''}
          onChange={(e) => onActualizar(index, 'notas_profesor', e.target.value)}
          placeholder="Indicaciones..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  )
}

export default RutinaEjercicioCampos
