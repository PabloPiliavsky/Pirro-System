// Anchored to REQ-PRG-004, REQ-PRG-012
import { useRef } from 'react'
import { CalendarDays } from 'lucide-react'
import { isoToDmy, dmyToIso } from '../utils/progresoFilters'

function formatMaskedDmyInput(rawValue) {
  const digits = String(rawValue).replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
}

export function DateFilterInput({ id, label, valueDmy, onChangeDmy }) {
  const nativeDateRef = useRef(null)
  const isoValue = dmyToIso(valueDmy)

  function handleTextChange(e) {
    const val = e.target.value
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      onChangeDmy(isoToDmy(val))
      return
    }
    onChangeDmy(formatMaskedDmyInput(val))
  }

  function handleNativeDatePick(e) {
    const pickedIso = e.target.value
    onChangeDmy(pickedIso ? isoToDmy(pickedIso) : '')
  }

  function handleOpenCalendar() {
    const el = nativeDateRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') {
      el.showPicker()
    } else {
      el.focus()
      el.click()
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-400">
        {label} <span className="text-[11px] text-slate-500 font-normal">(dd/mm/yyyy)</span>
      </label>

      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          aria-label={label}
          placeholder="dd/mm/yyyy"
          value={valueDmy}
          onChange={handleTextChange}
          className="w-full min-h-10 rounded-xl border border-slate-800 bg-slate-950 pl-3 pr-10 py-2 text-xs font-mono font-semibold text-white text-center placeholder:text-slate-500 focus:outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={handleOpenCalendar}
          title={`Abrir calendario para ${label}`}
          aria-label={`Abrir calendario para ${label}`}
          className="absolute right-2 flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-primary transition cursor-pointer"
        >
          <CalendarDays className="size-4" />
        </button>

        <input
          ref={nativeDateRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={isoValue}
          onChange={handleNativeDatePick}
          className="sr-only"
        />
      </div>
    </div>
  )
}
