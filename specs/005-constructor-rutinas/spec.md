# Especificación de Requisitos: 005 — Constructor de Rutinas Semanales por Alumno y Día

## 1. Propósito y Alcance
Implementar el constructor y gestor de rutinas semanales para el rol **Profesor**:
1. **Planificación Semanal por Alumno**: Selección de un alumno de la cartera del profesor y estructuración de sus rutinas por día de la semana (`Día 1`, `Día 2`... hasta `cantidad_dias_rutina`), permitiendo asignar un nombre temático a cada día (ej: *"Torso & Pectorales"*, *"Piernas & Glúteos"*).
2. **Configuración de Ejercicios por Día**: Selección interactiva de ejercicios del catálogo con valores sugeridos (`3` series, repeticiones *"10-12"*), permitiendo agregar un mismo ejercicio más de una vez con distintas variantes técnicas, e indicaciones pedagógicas exclusivas del profesor (`notas_profesor`).
3. **Reordenamiento y Control de Secuencia**: Reorganización secuencial de los ejercicios dentro de cada día (`orden`), con posibilidad de agregar, mover (subir/bajar) y quitar ejercicios.
4. **Preservación Histórica de Días Excedentes**: Si el alumno reduce su frecuencia semanal (ej: de 4 a 3 días), las rutinas de los días que excedan el límite se conservan en la base de datos como inactivas (`activa = false`) sin eliminarlas.
5. **Asistente Inteligente de Equipamiento**: Detección automática y advertencia visual si un ejercicio requiere equipamiento o máquinas que no están registradas en la sede asignada al alumno.
6. **Arquitectura y Proveedor Dual**: Paridad estricta entre `mockAdapter` (en `localStorage` con `pirro_mock_db_v1`) y `supabaseAdapter` (PostgreSQL / PostgREST con políticas RLS y transacción atómica de rutina + ejercicios).
7. **Modo de Entorno Confirmado (`Docker Gate`)**:
   - **Modo B — Con Docker / Supabase Activo Ahora**: Pruebas unitarias en modo Mock y pruebas de integración en vivo contra Supabase Local en Docker.

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Gestión de Rutinas Semanales (`REQ-RUT-001` a `REQ-RUT-005`)

- **`REQ-RUT-001` (Ubiquitous — Consulta de Rutinas por Alumno)**:
  El sistema **debe** proveer el método `rutinasService.getRutinasByAlumno(idAlumno)` retornando la lista completa de rutinas activas del alumno ordenadas por `numero_dia`, incluyendo los ejercicios asociados ordenados por `orden` con los datos de `ejercicios` y su equipamiento requerido.

- **`REQ-RUT-002` (Event-Driven — Inicialización de Días según Perfil)**:
  **CUANDO** el profesor seleccione un alumno en el constructor, el sistema **debe** generar pestañas para cada uno de los días configurados en su ficha (`cantidad_dias_rutina`), mostrando las rutinas previamente guardadas o un estado vacío listo para armar con nombre sugerido (ej: *"Día 1: Rutina"*).

- **`REQ-RUT-003` (Event-Driven — Guardado Atómico de Rutina y Ejercicios)**:
  **CUANDO** el profesor guarde la rutina de un día con `{ id_alumno, numero_dia, nombre_rutina, ejercicios }`, el sistema **debe** persistir de manera atómica la cabecera en `rutinas` y todas las filas en `rutina_ejercicios` (con `orden`, `series_objetivo`, `repeticiones_objetivo` y `notas_profesor`), reemplazando la lista previa de ejercicios de ese día en la misma transacción.

- **`REQ-RUT-004` (Unwanted Behavior — Validación Defensiva de Rutina)**:
  **SI** se intenta guardar una rutina sin nombre, sin alumno asignado, con un día fuera del rango 1 a 7, o con ejercicios que no tengan `series_objetivo >= 1` o `repeticiones_objetivo` vacías, **ENTONCES** el sistema **debe** rechazar la operación con el error `INVALID_RUTINA_PAYLOAD` indicando los campos observados.

- **`REQ-RUT-005` (Event-Driven — Reordenamiento y Precarga de Ejercicios)**:
  **CUANDO** el profesor agregue un ejercicio a la rutina, el sistema **debe** precargar `series_objetivo = 3` y `repeticiones_objetivo = '10-12'`, permitiendo agregar el mismo ejercicio más de una vez. Al cambiar la posición de un ejercicio (subir o bajar), el sistema **debe** recalcular secuencialmente el campo `orden` (1, 2, 3...) de forma reactiva.

---

### B. Asistente Inteligente de Equipamiento (`REQ-RUT-006` a `REQ-RUT-007`)

- **`REQ-RUT-006` (State-Driven — Advertencia de Máquina No Disponible en Sede)**:
  **MIENTRAS** el alumno tenga una sede asignada (`id_gimnasio NOT NULL`), **SI** el profesor selecciona o visualiza un ejercicio que tiene `requiere_equipamiento = true` cuyo `id_equipamiento_requerido` no figura entre los equipamientos registrados de esa sede, el sistema **debe** exhibir una insignia de advertencia en ámbar (*"⚠️ No disponible en Sede X"*) con el nombre de la máquina faltante.

- **`REQ-RUT-007` (Optional Feature — Selección sin Sede Asignada)**:
  **DONDE** el alumno no tenga sede asignada (`id_gimnasio IS NULL`), el sistema **debe** mostrar una advertencia informativa (*"Alumno sin sede asignada"*) si el ejercicio requiere equipamiento específico, sin bloquear la selección.

---

### C. Interfaz de Usuario del Constructor (`REQ-RUT-008` a `REQ-RUT-010`)

- **`REQ-RUT-008` (Ubiquitous — Panel Constructor de Rutinas del Profesor)**:
  La vista `/profesor/rutinas` **debe** presentar:
  1. Selector de alumno superior con avatar y búsqueda rápida.
  2. Barra de contexto del alumno: Sede asignada, días semanales configurados y botón para abrir su ficha médica en un modal emergente.
  3. Navegación por pestañas de días (`Día 1`, `Día 2`... hasta `cantidad_dias_rutina`).
  4. Encabezado editable para el nombre temático del día (ej: *"Torso Fuerza"*).
  5. Lista interactiva de tarjetas de ejercicio asignado con controles numéricos para series, campo de repeticiones objetivo, notas pedagógicas, y flechas para reordenar (subir/bajar) o eliminar.
  6. Botón `+ Agregar Ejercicio` que abre un diálogo modal de catálogo con búsqueda y filtros por grupo muscular.
  7. Botón destacado `Guardar Rutina` con estados de carga y feedback de éxito.

- **`REQ-RUT-009` (Ubiquitous — Modal Selector de Ejercicios del Catálogo)**:
  El modal de catálogo **debe** permitir buscar por nombre, filtrar por grupo muscular, visualizar si requiere máquina e indicar inmediatamente si la máquina está disponible en la sede del alumno seleccionado.

- **`REQ-RUT-010` (Ubiquitous — Micro-interacciones y Feedback)**:
  Todos los botones interactivos, pestañas y tarjetas **deben** incluir `cursor-pointer`, transiciones suaves y estados activos (`active:scale-95`).

---

### D. Proveedor Dual y Calidad de Código (`REQ-RUT-011` a `REQ-RUT-012`)

- **`REQ-RUT-011` (Ubiquitous — Paridad Estricta en Métodos de Servicio)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar idénticas firmas y respuestas:
  - `getRutinasByAlumno(idAlumno)`
  - `guardarRutinaCompleta(payload)`
  - `eliminarRutina(idRutina)`
  garantizando paridad total de contratos.

- **`REQ-RUT-012` (Ubiquitous — Cobertura Automatizada y Clean Code)**:
  Todo componente y función **debe** respetar el límite de $\sim 40$ líneas por función y $\sim 100$ líneas por archivo, sin punto y coma (`;`), y contar con pruebas unitarias (`rutinasService.test.js`) y de integración (`rutinasService.supabase.test.js`) aprobadas al 100%.
