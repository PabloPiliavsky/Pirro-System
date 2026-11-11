# Desglose de Tareas: 006 — Planilla Interactiva Mobile-First, Modal por Serie y Guardado Local Batch (Rol Alumno)

## Fase 1: Capa de Servicios y Paridad Dual
- [x] **TASK-001**: Crear `src/services/entrenamientoService.js` con métodos `getRutinasAlumno`, `guardarBatch` y `getHistorialAlumno`. [REQ-TRN-001, REQ-TRN-007, REQ-TRN-009, REQ-TRN-011]
- [x] **TASK-002**: Implementar `getHistorialByAlumno(idAlumno)` en `mockAdapter.js` y `mockAdapterQueries.js` con formato relacional. [REQ-TRN-009, REQ-TRN-011]
- [x] **TASK-003**: Implementar `getHistorialByAlumno(idAlumno)` en `supabaseAdapter.js` con consulta a `registros_rutina` y `detalle_series`. [REQ-TRN-009, REQ-TRN-011]
- [x] **TASK-004**: Extender `useRoutineLocalStorage.js` para permitir actualizar `fechaRealizacion` y consultar estadísticas del borrador. [REQ-TRN-002, REQ-TRN-005, REQ-TRN-006]

## Fase 2: Componentes UI Mobile-First
- [x] **TASK-005**: Crear `EntrenamientoHeader.jsx` con saludo deportivo, selector de día de la semana y selector de fecha. [REQ-TRN-002, REQ-TRN-010, REQ-TRN-012]
- [x] **TASK-006**: Crear `SerieCellButton.jsx` con visualización táctil de serie pendiente vs completada en borrador. [REQ-TRN-003, REQ-TRN-010, REQ-TRN-012]
- [x] **TASK-007**: Crear `EjercicioCard.jsx` con orden, nombre, badge muscular, notas del profesor y fila de series. [REQ-TRN-001, REQ-TRN-003, REQ-TRN-010, REQ-TRN-012]
- [x] **TASK-008**: Crear `SerieInputModal.jsx` y `SerieModalFormFields.jsx` para carga táctil rápida de repeticiones, peso y comentarios. [REQ-TRN-004, REQ-TRN-005, REQ-TRN-010, REQ-TRN-012]
- [x] **TASK-009**: Crear `GuardarBatchStickyBar.jsx` con progreso de series y botón de guardado batch atómico. [REQ-TRN-007, REQ-TRN-008, REQ-TRN-010, REQ-TRN-012]
- [x] **TASK-010**: Crear `PlanillaEntrenamientoPage.jsx` integrando orquestación de la sesión de entrenamiento. [REQ-TRN-001 a REQ-TRN-008, REQ-TRN-010]
- [x] **TASK-011**: Crear `HistorialEntrenamientosPage.jsx` con sesiones pasadas y desglose de cargas. [REQ-TRN-009, REQ-TRN-010]
- [x] **TASK-012**: Conectar rutas `/alumno`, `/alumno/rutinas` e `/alumno/historial` en `AppRoutes.jsx`. [REQ-TRN-001, REQ-TRN-009]

## Fase 3: Optimización, Revisión y Pruebas
- [x] **TASK-013**: Ejecutar `/refactor` para asegurar apego estricto a las métricas de `AGENT.md` (~40 líneas por función, ~100 líneas por archivo, una función por archivo, uso de `VStack`/`HStack`, sin semicolons, sin ternarias innecesarias). [REQ-TRN-012]
- [x] **TASK-014**: Ejecutar `/review` con matriz de seguridad, manejo de errores y mantenibilidad. [REQ-TRN-012]
- [x] **TASK-015**: Crear pruebas unitarias y de UI en modo Mock (`Vitest`). [REQ-TRN-001 a REQ-TRN-010]
- [x] **TASK-016**: Crear pruebas de integración en vivo contra Docker Supabase (`entrenamiento.supabase.test.js`). [REQ-TRN-001, REQ-TRN-007, REQ-TRN-011]
- [x] **TASK-017**: Ejecutar `npm run test`, `npm run test:supabase` y `npm run build`. [REQ-TRN-011]
- [x] **TASK-018**: Documentar la guía de verificación manual paso a paso en la app.
