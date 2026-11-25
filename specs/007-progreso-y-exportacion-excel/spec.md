# Especificación de Requisitos: 007 — Historial de Cargas del Alumno, Seguimiento y Exportación a Excel `.xlsx` (Rol Profesor)

## 1. Propósito y Alcance
Implementar el módulo de seguimiento histórico de progreso y exportación de reportes en formato Excel (`.xlsx`) para el rol **Profesor** (`/profesor/progreso`), respetando la arquitectura dual (`mockAdapter` y `supabaseAdapter`) y las reglas de la skill `gym-excel-export-reporting`:
1. **Selección de Alumno con Opción de Incluir Inactivos**: Por defecto el selector muestra los alumnos activos (`estado = true`), ofreciendo un control explícito (*"¿Incluir alumnos dados de baja (inactivos)?"*) para consultar y exportar también el historial de exalumnos.
2. **Filtros Combinados de Evolución**: Filtrado reactivo del historial del alumno seleccionado por rango de fechas (`fechaDesde`, `fechaHasta`), rutina (`idRutina`) y ejercicio (`idEjercicio`).
3. **Métricas Rápidas de Seguimiento (KPIs)**: Tarjetas de resumen calculadas en base al conjunto filtrado: Total de sesiones realizadas, Total de series ejecutadas, Récord de peso máximo (PR en kg) y Última fecha de entrenamiento.
4. **Doble Modo de Visualización Modular (Separado en Componentes Independientes)**:
   - **Vista Por Sesión (`ProgresoSesionesView.jsx`)**: Tarjetas agrupadas por sesión (`fecha_realizacion` + rutina) con el desglose de ejercicios, píldoras de series (`reps × kg`) y comentarios del alumno.
   - **Vista Tabla de Series (`ProgresoTablaSeriesView.jsx`)**: Tabla cronológica plana fila por serie para comparar rápidamente la progresión de cargas y repeticiones.
   - Ambas vistas están desacopladas en archivos de componentes independientes y conmutables desde la interfaz.
5. **Generador y Exportador a Excel (`.xlsx`) con Selector de Columnas**:
   - Modal configurador (`ExcelExportModal.jsx`) que permite al profesor elegir qué columnas incluir en cada una de las 3 hojas reglamentarias (`Ficha del Alumno`, `Rutinas Semanales`, `Historial de Entrenamientos`) y si desea exportar el historial completo o solo las filas filtradas.
   - Lógica pura y desacoplada en `src/features/progreso-excel/utils/excelBuilder.js`, sin exponer IDs internos (`id_persona`, `client_submission_id`).
6. **Modo de Entorno Confirmado (`Docker Gate`)**:
   - **Modo B — Con Docker / Supabase Activo Ahora**: Pruebas automatizadas en modo Mock y pruebas de integración reales contra Supabase Local.

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Selección de Alumno y Consulta Dual (`REQ-PRG-001` a `REQ-PRG-003`)

- **`REQ-PRG-001` (Ubiquitous — Consulta Integral de Reporte de Progreso)**:
  El sistema **debe** proveer el servicio `progresoService.getReporteAlumno(idAlumno)` que retorne de forma unificada `{ alumno, rutinas, historial }` con paridad estricta de contratos entre `mockAdapter` y `supabaseAdapter`.

- **`REQ-PRG-002` (State-Driven — Filtro de Alumnos Activos e Inactivos)**:
  **MIENTRAS** la opción *"¿Incluir alumnos dados de baja (inactivos)?"* esté desactivada (valor por defecto), el selector de alumnos **debe** listar únicamente alumnos con `estado === true`. **CUANDO** el profesor active dicha opción, el selector **debe** incluir también a los alumnos con `estado === false` identificándolos con la etiqueta `(Inactivo)`.

- **`REQ-PRG-003` (Event-Driven — Carga Reactiva del Alumno Seleccionado)**:
  **CUANDO** el profesor seleccione un alumno, el sistema **debe** cargar su ficha física/deportiva, sus rutinas semanales activas y su historial completo de entrenamientos, reiniciando los filtros específicos de rutina y ejercicio.

---

### B. Filtrado Multi-Criterio y KPIs de Evolución (`REQ-PRG-004` a `REQ-PRG-005`)

- **`REQ-PRG-004` (Event-Driven — Filtrado por Fecha, Rutina y Ejercicio)**:
  **CUANDO** el profesor aplique o modifique los filtros de `fechaDesde`, `fechaHasta`, `idRutina` o `idEjercicio`, el sistema **debe** filtrar en tiempo real las sesiones y series exhibidas, manteniendo únicamente aquellas que cumplan todos los criterios activos.

- **`REQ-PRG-005` (Ubiquitous — Tarjetas de Resumen KPI)**:
  El panel de progreso **debe** calcular y visualizar cuatro indicadores clave basados en los resultados filtrados actuales:
  1. **Sesiones**: Cantidad de entrenamientos registrados que contienen series coincidentes.
  2. **Series Totales**: Suma de series ejecutadas dentro del filtro activo.
  3. **Récord de Peso (PR)**: Mayor `peso_utilizado` (en kg) registrado en las series filtradas.
  4. **Última Fecha**: Fecha de realización más reciente dentro del conjunto filtrado.

---

### C. Modos de Visualización Desacoplados (`REQ-PRG-006` a `REQ-PRG-007`)

- **`REQ-PRG-006` (Ubiquitous — Separación Modular de Vistas de Historial)**:
  El historial filtrado **debe** poder visualizarse mediante dos componentes independientes y desacoplados en archivos distintos:
  1. `ProgresoSesionesView.jsx`: Vista agrupada por tarjeta de sesión (`fecha_realizacion`, nombre de rutina y bloques de ejercicios con sus series y comentarios).
  2. `ProgresoTablaSeriesView.jsx`: Vista tabular plana donde cada fila representa una serie individual (`Fecha`, `Rutina`, `Ejercicio`, `N° Serie`, `Reps Obj`, `Reps Realizadas`, `Peso (kg)`, `Comentario Alumno`).

- **`REQ-PRG-007` (Unwanted Behavior — Estado Vacío de Resultados)**:
  **SI** el alumno seleccionado no posee entrenamientos registrados o ningún registro coincide con los filtros aplicados, **ENTONCES** el sistema **debe** mostrar un estado vacío claro indicando el motivo y un botón para limpiar los filtros activos.

---

### D. Generación y Exportación a Excel `.xlsx` (`REQ-PRG-008` a `REQ-PRG-011`)

- **`REQ-PRG-008` (Ubiquitous — Estructura de 3 Hojas en `excelBuilder.js`)**:
  La utilidad pura `src/features/progreso-excel/utils/excelBuilder.js` **debe** construir un libro Excel (`.xlsx`) estructurado en tres hojas:
  1. **Hoja 1 — `Ficha del Alumno`**: Nombre y Apellido, Edad, Altura (cm), Peso (kg), Gimnasio al que asiste, Días por semana, Salud/Enfermedades y Comentarios del profesor.
  2. **Hoja 2 — `Rutinas Semanales`**: Día (`Día N - Nombre`), Orden, Ejercicio, Músculos, Máquina/Elemento, Series Objetivo, Repeticiones Objetivo y Notas.
  3. **Hoja 3 — `Historial de Entrenamientos`**: Tabla cronológica con `Fecha Realización`, `Rutina`, `Ejercicio`, `N° Serie`, `Reps Objetivo`, `Reps Realizadas`, `Peso (kg)` y `Comentario Alumno`.

- **`REQ-PRG-009` (Event-Driven — Configuración de Columnas a Exportar)**:
  **CUANDO** el profesor presione **"Exportar Excel (.xlsx)"**, el sistema **debe** abrir un modal de configuración donde pueda marcar o desmarcar qué columnas incluir en cada una de las 3 hojas y elegir si exportar el historial filtrado actual o el historial completo del alumno.

- **`REQ-PRG-010` (Unwanted Behavior — Prohibición de Exposición de IDs Internos)**:
  **SI** se genera un archivo `.xlsx`, **ENTONCES** el sistema **no debe** incluir bajo ninguna circunstancia columnas con identificadores internos (`id_persona`, `id_usuario`, `id_rutina`, `client_submission_id`) ni JSON crudo.

- **`REQ-PRG-011` (Ubiquitous — Nombre Estándar del Archivo Descargado)**:
  El archivo exportado **debe** nombrarse automáticamente con el formato `Pirro_Alumno_<Nombre>_<Apellido>_<YYYY-MM-DD>.xlsx` sanitizando tildes y espacios.

---

### E. Paridad Dual y Clean Code (`REQ-PRG-012`)

- **`REQ-PRG-012` (Ubiquitous — Cumplimiento de Constitución y AGENT.md)**:
  Toda la implementación **debe** respetar:
  - Paridad estricta de contratos entre `mockAdapter` y `supabaseAdapter`.
  - Funciones de máximo ~40 líneas y archivos de ~100 líneas.
  - Uso consistente de `VStack` y `HStack`, sin punto y coma (`;`).
