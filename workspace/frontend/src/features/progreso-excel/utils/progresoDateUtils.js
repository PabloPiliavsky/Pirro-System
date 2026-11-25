// Anchored to REQ-PRG-004, REQ-PRG-012
export function isoToDmy(isoStr) {
  if (!isoStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return ''
  const [y, m, d] = isoStr.split('-')
  return `${d}/${m}/${y}`
}

export function dmyToIso(dmyStr) {
  if (!dmyStr) return ''
  const trimmed = String(dmyStr).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return ''
  const d = match[1].padStart(2, '0')
  const m = match[2].padStart(2, '0')
  const y = match[3]
  return `${y}-${m}-${d}`
}

export function buildDefaultMonthRange(nowDate = new Date()) {
  const todayIso = nowDate.toISOString().slice(0, 10)
  const refDate = new Date(`${todayIso}T12:00:00Z`)
  const oneMonthAgo = new Date(refDate)
  oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1)
  return {
    fechaDesde: oneMonthAgo.toISOString().slice(0, 10),
    fechaHasta: todayIso,
  }
}

export function createInitialFiltersForHistorial() {
  const { fechaDesde, fechaHasta } = buildDefaultMonthRange()
  return {
    fechaDesde: isoToDmy(fechaDesde),
    fechaHasta: isoToDmy(fechaHasta),
    idRutina: 'all',
    idEjercicio: 'all',
  }
}
