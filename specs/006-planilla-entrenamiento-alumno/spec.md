# Especificación de Requisitos: 006 — Planilla Interactiva Mobile-First, Modal por Serie y Guardado Local Batch (Rol Alumno)

## 1. Propósito y Alcance
Implementar la experiencia de entrenamiento en vivo para el rol **Alumno**, permitiendo consultar sus rutinas asignadas, registrar series en tiempo real en el gimnasio de manera offline-first y persistir la sesión completa mediante un guardado atómico en lote:
1. **Visualización Mobile-First de Rutinas Asignadas**: Selección reactiva del día de entrenamiento (`Día 1`, `Día 2`, etc.) y fecha de realización (`fecha_realizacion`, por defecto hoy), visualizando los ejercicios asignados en orden secuencial con sus notas pedagógicas del profesor.
2. **Grilla Interactiva de Series**: Cada tarjeta de ejercicio renderiza tantas columnas o celdas interactivas como series objetivo (`series_objetivo`) fueron planificadas. Cada celda indica visualmente si está pendiente o completada en borrador (con repeticiones realizadas y peso utilizado).
3. **Modal Interactivo por Serie**: Al presionar una celda de serie, se abre un diálogo modal optimizado para móvil con valores objetivo sugeridos (`repeticiones_objetivo`), controles de entrada rápida para `repeticiones_realizadas`, `peso_utilizado` (kg) y un campo opcional para `comentario_alumno`.
4. **Sincronización Offline-First (`useRoutineLocalStorage`)**: Cada serie completada en el modal se actualiza de forma inmediata en el almacenamiento local (`localStorage`), sin generar ninguna petición de red o llamada a base de datos durante el entrenamiento activo.
5. **Transacción Única en Lote (`guardar_entrenamiento_batch`)**: Al finalizar la sesión, el alumno presiona **"Guardar Entrenamiento"**. El sistema valida que exista al menos una serie completada y despacha un único payload con clave de idempotencia (`clientSubmissionId`) hacia el proveedor activo (`mockAdapter` o `supabaseAdapter` vía RPC `guardar_entrenamiento_batch`). Al confirmarse el éxito, el borrador local se limpia automáticamente.
6. **Historial de Entrenamientos del Alumno**: Vista `/alumno/historial` donde el alumno puede explorar sus sesiones previas guardadas, fechas de ejecución, ejercicios realizados, pesos y comentarios.
7. **Modo de Entorno Confirmado (`Docker Gate`)**:
   - **Modo B — Con Docker / Supabase Activo Ahora**: Pruebas unitarias en modo Mock y pruebas de integración en vivo contra Supabase Local en Docker.

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Carga y Visualización de Rutinas (`REQ-TRN-001` a `REQ-TRN-003`)

- **`REQ-TRN-001` (Ubiquitous — Consulta de Rutinas del Alumno)**:
  El sistema **debe** proveer el método `entrenamientoService.getRutinasAlumno(idAlumno)` que obtiene las rutinas activas del alumno autenticado ordenadas por `numero_dia`, con sus ejercicios ordenados por `orden`, incluyendo nombre del ejercicio, grupo muscular, equipamiento requerido y notas pedagógicas del profesor.

- **`REQ-TRN-002` (Event-Driven — Selección de Día y Fecha de Realización)**:
  **CUANDO** el alumno acceda a la vista de entrenamiento (`/alumno` o `/alumno/rutinas`), el sistema **debe** seleccionar por defecto el primer día asignado y la fecha actual en formato ISO (`YYYY-MM-DD`), permitiendo cambiar libremente de día y ajustar la fecha del entrenamiento.

- **`REQ-TRN-003` (State-Driven — Grilla de Series por Ejercicio)**:
  **MIENTRAS** se visualice un ejercicio en la planilla, el sistema **debe** renderizar una fila de celdas interactivas correspondiente a cada una de sus series (`1` a `series_objetivo`). Las celdas con datos en el borrador local deben resaltar visualmente con estilo completado (ej: fondo verde/esmeralda con indicación de peso y reps), diferenciándose de las series pendientes.

---

### B. Modal Interactivo por Serie y Borrador Local (`REQ-TRN-004` a `REQ-TRN-006`)

- **`REQ-TRN-004` (Event-Driven — Apertura del Modal por Serie)**:
  **CUANDO** el alumno toque cualquier celda de serie de un ejercicio, el sistema **debe** abrir un modal táctil centrado o emergente mostrando:
  1. Nombre del ejercicio y número de serie actual (ej: *"Serie 2 de 4"*).
  2. Repeticiones objetivo planificadas por el profesor como referencia.
  3. Campo numérico táctil para `repeticiones_realizadas` (con valor previo del borrador o sugerido según el objetivo).
  4. Campo numérico táctil para `peso_utilizado` en kilogramos.
  5. Campo de texto opcional para `comentario_alumno` (ej: *"Buena congestión, subir 2.5kg la próxima"*).

- **`REQ-TRN-005` (Event-Driven — Persistencia Inmediata en Borrador Local)**:
  **CUANDO** el alumno confirme la carga de una serie en el modal ("Guardar Serie"), el sistema **debe** persistir instantáneamente dicha serie en el borrador de `localStorage` (`pirro_draft_${idAlumno}_${idRutina}`) mediante `useRoutineLocalStorage`, sin realizar peticiones de red ni llamadas HTTP/PostgREST.

- **`REQ-TRN-006` (Ubiquitous — Idempotencia del Borrador)**:
  El borrador local **debe** mantener una clave única de idempotencia `clientSubmissionId` generada mediante `crypto.randomUUID()` al inicializarse, conservándola a lo largo de toda la sesión para evitar inserciones duplicadas ante reintentos de red.

---

### C. Guardado Transaccional por Lote (`REQ-TRN-007` a `REQ-TRN-008`)

- **`REQ-TRN-007` (Event-Driven — Guardado Batch Atómico)**:
  **CUANDO** el alumno presione el botón principal **"Guardar Entrenamiento"**, el sistema **debe** enviar el lote completo `{ clientSubmissionId, idAlumno, idRutina, fechaRealizacion, series }` a través de `entrenamientoService.guardarBatch(payload)`. Si la respuesta es exitosa (`{ ok: true }`), el sistema **debe** purgar el borrador de `localStorage` y emitir una notificación de confirmación al usuario.

- **`REQ-TRN-008` (Unwanted Behavior — Validación Defensiva de Guardado Batch)**:
  **SI** el alumno intenta guardar una sesión sin series completadas (`series.length === 0`), o si alguna serie tiene valores inválidos (`repeticionesRealizadas < 0` o `pesoUtilizado < 0`), **ENTONCES** el sistema **debe** bloquear el envío, mostrando un mensaje explicativo y resaltando la necesidad de completar al menos una serie.

---

### D. Historial de Entrenamientos y Navegación (`REQ-TRN-009` a `REQ-TRN-010`)

- **`REQ-TRN-009` (Ubiquitous — Consulta de Historial de Entrenamientos)**:
  La vista `/alumno/historial` **debe** invocar `entrenamientoService.getHistorialAlumno(idAlumno)` y mostrar el listado cronológico descendente de las sesiones registradas por el alumno, indicando fecha de realización, nombre de la rutina, total de series ejecutadas y desglose de cargas por ejercicio.

- **`REQ-TRN-010` (Ubiquitous — Estándar UI/UX Mobile-First)**:
  Todas las pantallas del alumno **deben** respetar el estándar Mobile-First:
  1. Controles y botones con altura táctil mínima de 44px (`min-h-11`).
  2. Tipografía de alta legibilidad y jerarquía clara en condiciones de iluminación de gimnasio.
  3. Navegación fluida e integrada con la barra inferior `AlumnoBottomNav`.
  4. Micro-interacciones con `active:scale-95` y transiciones suaves sin retrasos percibidos.

---

### E. Paridad Dual y Arquitectura de Código (`REQ-TRN-011` a `REQ-TRN-012`)

- **`REQ-TRN-011` (Ubiquitous — Paridad Estricta en Métodos de Servicio)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar con idénticas firmas y formatos de retorno:
  - `getRutinasByAlumno(idAlumno)`
  - `guardarEntrenamientoBatch(payload)`
  - `getHistorialByAlumno(idAlumno)`

- **`REQ-TRN-012` (Ubiquitous — Convenciones de Código y AGENT.md)**:
  Todo el código implementado **debe** cumplir:
  - Máximo ~40 líneas por función y ~100 por archivo.
  - Una sola función exportada por archivo componente.
  - Estructuración obligatoria con `VStack` y `HStack`.
  - Sin callbacks innecesarios ni closures anónimas redundantes.
  - Cero puntos y coma (`;`).
  - Sin operadores ternarios redundantes en datos obligatorios garantizados por el contrato.
