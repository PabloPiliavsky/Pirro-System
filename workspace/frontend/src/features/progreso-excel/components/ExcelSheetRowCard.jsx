// Anchored to REQ-PRG-008, REQ-PRG-009, REQ-PRG-012
export function ExcelSheetRowCard({
  sheetKey,
  title,
  columns,
  isSheetEnabled,
  onToggleSheet,
  selectedKeys,
  onToggleColumn,
}) {
  return (
    <div
      className={`rounded-xl border px-3.5 py-2.5 transition-all ${
        isSheetEnabled
          ? 'border-slate-800 bg-slate-950/90'
          : 'border-slate-800/50 bg-slate-950/40 opacity-60'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
        <label className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary cursor-pointer">
          <input
            type="checkbox"
            checked={isSheetEnabled}
            onChange={(e) => onToggleSheet(sheetKey, e.target.checked)}
            aria-label={`Incluir ${title}`}
            className="size-4 accent-primary rounded cursor-pointer"
          />
          <span>{title}</span>
        </label>

        <span className="text-[11px] font-semibold text-slate-400">
          {isSheetEnabled
            ? `${selectedKeys.length} de ${columns.length} columnas seleccionadas`
            : 'Hoja excluida del archivo Excel'}
        </span>
      </div>

      {isSheetEnabled && (
        <div className="flex flex-wrap items-center gap-1.5">
          {columns.map((col) => {
            const checked = selectedKeys.includes(col.key)
            return (
              <label
                key={col.key}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer transition select-none ${
                  checked
                    ? 'border-primary/40 bg-primary/15 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleColumn(sheetKey, col.key)}
                  className="size-3.5 accent-primary rounded cursor-pointer"
                />
                <span>{col.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
