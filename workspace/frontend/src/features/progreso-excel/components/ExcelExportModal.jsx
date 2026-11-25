// Anchored to REQ-PRG-008, REQ-PRG-009, REQ-PRG-010, REQ-PRG-011, REQ-PRG-012
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HStack } from '@/components/ui/HStack'
import { VStack } from '@/components/ui/VStack'
import {
  FICHA_COLUMNS,
  RUTINAS_COLUMNS,
  HISTORIAL_COLUMNS,
  createDefaultColumnsSelection,
  createDefaultSheetsSelection,
} from '../utils/excelColumnsConfig'
import { buildExcelFileName } from '../utils/excelBuilder'
import { ExcelSheetRowCard } from './ExcelSheetRowCard'
import { FileSpreadsheet, X, CheckSquare } from 'lucide-react'

const SHEETS_META = [
  { key: 'ficha', title: 'Hoja 1: Ficha del Alumno', columns: FICHA_COLUMNS },
  { key: 'rutinas', title: 'Hoja 2: Rutinas Semanales', columns: RUTINAS_COLUMNS },
  { key: 'historial', title: 'Hoja 3: Historial de Entrenamientos', columns: HISTORIAL_COLUMNS },
]

export function ExcelExportModal({ isOpen, onClose, alumno, onConfirmExport, hasActiveFilters }) {
  const [columnsSelection, setColumnsSelection] = useState(createDefaultColumnsSelection)
  const [sheetsSelection, setSheetsSelection] = useState(createDefaultSheetsSelection)
  const [activeTab, setActiveTab] = useState('all')
  const [exportOnlyFiltered, setExportOnlyFiltered] = useState(true)

  if (!isOpen) return null

  function handleToggleSheet(sheetKey, checked) {
    setSheetsSelection((prev) => {
      const next = { ...prev, [sheetKey]: checked }
      return Object.values(next).some(Boolean) ? next : prev
    })
  }

  function handleToggleColumn(sheetKey, colKey) {
    setColumnsSelection((prev) => {
      const current = prev[sheetKey] || []
      const exists = current.includes(colKey)
      if (exists && current.length <= 1) return prev
      const updated = exists ? current.filter((k) => k !== colKey) : [...current, colKey]
      return { ...prev, [sheetKey]: updated }
    })
  }

  function handleSelectAll() {
    setSheetsSelection(createDefaultSheetsSelection())
    setColumnsSelection(createDefaultColumnsSelection())
  }

  const visibleSheets =
    activeTab === 'all' ? SHEETS_META : SHEETS_META.filter((s) => s.key === activeTab)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configurar exportación a Excel"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4"
    >
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-2xl max-h-[92vh] flex flex-col">
        <VStack className="gap-3">
          <HStack justify="between" align="center" className="border-b border-slate-800 pb-2.5">
            <HStack align="center" className="gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="size-5" />
              </div>
              <VStack className="gap-0">
                <h2 className="text-base font-black text-white">
                  Configurar Hojas y Columnas a Exportar (.xlsx)
                </h2>
                <span className="text-xs font-mono text-slate-400">{buildExcelFileName(alumno)}</span>
              </VStack>
            </HStack>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal de exportación"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </HStack>

          <HStack justify="between" align="center" className="flex-wrap gap-2">
            <div role="tablist" aria-label="Navegación entre hojas de Excel" className="inline-flex flex-wrap rounded-xl border border-slate-800 bg-slate-950 p-1 gap-1">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ver Todas Juntas (3)
              </button>
              {SHEETS_META.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === s.key}
                  onClick={() => setActiveTab(s.key)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    activeTab === s.key ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.title} {!sheetsSelection[s.key] ? '(Omitida)' : ''}
                </button>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} className="h-8 gap-1.5 text-xs border-slate-700 bg-slate-950 text-slate-200 hover:text-white cursor-pointer">
              <CheckSquare className="size-3.5" />
              Activar todas las hojas y columnas
            </Button>
          </HStack>

          <div className="space-y-2.5 overflow-y-auto max-h-[55vh] pr-1">
            {visibleSheets.map((sheet) => (
              <ExcelSheetRowCard
                key={sheet.key}
                sheetKey={sheet.key}
                title={sheet.title}
                columns={sheet.columns}
                isSheetEnabled={Boolean(sheetsSelection[sheet.key])}
                onToggleSheet={handleToggleSheet}
                selectedKeys={columnsSelection[sheet.key] || []}
                onToggleColumn={handleToggleColumn}
              />
            ))}
          </div>

          <HStack justify="between" align="center" className="flex-wrap gap-2 pt-2.5 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={exportOnlyFiltered}
                onChange={(e) => setExportOnlyFiltered(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
              <span>
                Exportar en Hoja 3 según los filtros aplicados
                {!hasActiveFilters ? ' (rango actual)' : ''}
              </span>
            </label>
            <HStack align="center" className="gap-2">
              <Button type="button" variant="ghost" onClick={onClose} className="cursor-pointer">
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => onConfirmExport({ columnsSelection, sheetsSelection, exportOnlyFiltered })}
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
              >
                <FileSpreadsheet className="size-4" />
                Descargar Archivo .xlsx
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </div>
    </div>
  )
}
