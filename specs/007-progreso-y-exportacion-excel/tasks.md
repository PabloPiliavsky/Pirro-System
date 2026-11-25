# Desglose de Tareas Atómicas: 007 — Historial de Cargas del Alumno, Seguimiento y Exportación a Excel `.xlsx`

- [x] **T-007-01**: Crear rama `feature/007-progreso-y-exportacion-excel` desde `main` y documentar `spec.md`, `plan.md` y `tasks.md`. (`REQ-PRG-001` a `REQ-PRG-012`)
- [x] **T-007-02**: Instalar la dependencia `xlsx` en `workspace/frontend` para la generación y descarga de libros `.xlsx` en el navegador y en pruebas de `Vitest`. (`REQ-PRG-008`)
- [x] **T-007-03**: Implementar `src/services/progresoService.js` consumiendo `getProvider()` con paridad entre `mockAdapter` y `supabaseAdapter` (`getAlumnoById`, `getRutinasByAlumno`, `getHistorialByAlumno`). (`REQ-PRG-001`, `REQ-PRG-012`)
- [x] **T-007-04**: Implementar utilidades puras de filtrado, aplanado de series y cálculo de KPIs en `src/features/progreso-excel/utils/progresoFilters.js`. (`REQ-PRG-004`, `REQ-PRG-005`)
- [x] **T-007-05**: Implementar la configuración de columnas (`excelColumnsConfig.js`) y el constructor puro de libros Excel de 3 hojas (`excelBuilder.js`) respetando el límite de ~40 líneas por función y sin exponer IDs internos. (`REQ-PRG-008`, `REQ-PRG-009`, `REQ-PRG-010`, `REQ-PRG-011`)
- [x] **T-007-06**: Construir los componentes visuales desacoplados:
  - `ProgresoAlumnoSelector.jsx` (con switch *"¿Incluir alumnos dados de baja (inactivos)?"*)
  - `ProgresoFiltersBar.jsx`
  - `ProgresoKpiCards.jsx`
  - `ProgresoSesionesView.jsx` (Vista 1 en archivo independiente)
  - `ProgresoTablaSeriesView.jsx` (Vista 2 en archivo independiente)
  - `ExcelExportModal.jsx` (Selector de columnas a exportar)
  - `ProgresoExcelPage.jsx` + `useProgresoExcel.js`
- [x] **T-007-07**: Conectar la ruta `/profesor/progreso` en `src/app/AppRoutes.jsx` y aplicar `/refactor` verificando límites de líneas y Clean Code. (`REQ-PRG-006`, `REQ-PRG-012`)
- [x] **T-007-08**: Crear y ejecutar las pruebas unitarias/UI en modo Mock (`progresoExcel.test.js`, `ProgresoExcelPage.test.jsx`) y las pruebas de integración/paridad con Supabase en Docker (`progresoExcel.supabase.test.js`), además de validar con `npm run build`. (`REQ-PRG-001` a `REQ-PRG-012`)
