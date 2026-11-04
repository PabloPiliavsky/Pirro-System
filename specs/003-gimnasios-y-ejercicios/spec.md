# Especificación de Requisitos: 003 — ABM de Gimnasios, Equipamiento y Catálogo de Ejercicios

## 1. Propósito y Alcance
Implementar la gestión administrativa completa para el rol **Profesor** de:
1. **Gimnasios y Sedes**: Creación, edición, consulta y baja lógica (`estado = false`) de los gimnasios donde entrenan los alumnos, gestionando sus horarios de apertura/cierre, dirección y estado operativo.
2. **Equipamiento por Sede**: Asignación y desasignación de equipamiento disponible (`máquina`, `peso_libre`, `accesorio`, `cardio`) para cada gimnasio, con control de cantidades y observaciones técnicas.
3. **Catálogo de Ejercicios**: Creación, edición, consulta con filtros (por grupo muscular y texto) y baja lógica de los ejercicios propios del profesor, vinculando opcionalmente el equipamiento/máquina requerida, indicaciones de ejecución y enlace de video tutorial.
4. **Arquitectura y Proveedor Dual**: Paridad estricta entre `mockAdapter` (persistido en `localStorage` bajo `pirro_mock_db_v1`) y `supabaseAdapter` (PostgreSQL / PostgREST con políticas RLS para rol `'profesor'`).
5. **Modo de Entorno Confirmado (`Docker Gate`)**:
   - **Modo B — Con Docker / Supabase Activo Ahora**: Se validan tanto las pruebas en modo Mock como las pruebas de integración en vivo contra Supabase Local en Docker (`npm run test` y `npm run test:supabase`).

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Gestión de Gimnasios y Equipamiento (`REQ-GYM-001` a `REQ-GYM-006`)

- **`REQ-GYM-001` (Ubiquitous — Consulta de Gimnasios)**:
  El sistema **debe** proveer el método `gimnasiosService.getGimnasios()` retornando la lista de gimnasios pertenecientes al profesor activo, incluyendo el desglose relacional de su equipamiento disponible (`gimnasio_equipamiento` con datos de `equipamiento`).

- **`REQ-GYM-002` (Event-Driven — Creación y Edición de Gimnasios)**:
  **CUANDO** el profesor envíe el formulario de alta o edición de gimnasio con `{ nombre, direccion, horario_apertura, horario_cierre, equipamientoIds }`, el servicio **debe** persistir los datos de la sede y sincronizar la tabla intermedia `gimnasio_equipamiento` en una sola operación atómica, garantizando que no existan duplicados (`UNIQUE (id_gimnasio, id_equipamiento)`).

- **`REQ-GYM-003` (Unwanted Behavior — Validación de Datos de Gimnasio)**:
  **SI** se intenta guardar un gimnasio sin `nombre` o con caracteres en blanco, **ENTONCES** el sistema **debe** rechazar la operación con código `INVALID_GYM_DATA` y mensaje de error claro en pantalla.

- **`REQ-GYM-004` (Event-Driven — Baja Lógica de Gimnasio)**:
  **CUANDO** el profesor elimine un gimnasio, el sistema **debe** realizar una baja lógica (`estado = false`) preservando intacta la integridad histórica de rutinas y entrenamientos asociados.

- **`REQ-GYM-005` (Ubiquitous — Catálogo Maestro de Equipamiento)**:
  El sistema **debe** proveer `gimnasiosService.getEquipamientoMaestro()` para listar las máquinas, pesos libres y accesorios disponibles para ser asignados a las sedes.

- **`REQ-GYM-006` (Ubiquitous — Interfaz de Sedes del Profesor)**:
  La vista `/profesor/gimnasios` **debe** renderizar tarjetas interactivas de cada sede con su dirección, horarios, contador de equipamiento asignado, botón de edición, botón de alta de nueva sede ("Nueva Sede") y diálogo modal accesible para la gestión de máquinas.

---

### B. Catálogo de Ejercicios del Profesor (`REQ-EJE-001` a `REQ-EJE-006`)

- **`REQ-EJE-001` (Ubiquitous — Consulta de Catálogo con Filtros)**:
  El sistema **debe** proveer `ejerciciosService.getEjercicios()` permitiendo filtrar dinámicamente en el cliente por grupo muscular (`Pectorales`, `Espalda`, `Cuádriceps`, `Isquiotibiales`, `Glúteos`, `Hombros`, `Bíceps`, `Tríceps`, `Core / Zona Media`, `Cardio`) y por término de búsqueda en el nombre.

- **`REQ-EJE-002` (Event-Driven — Alta y Modificación de Ejercicio)**:
  **CUANDO** el profesor guarde un ejercicio con `{ nombre, grupo_muscular, requiere_equipamiento, id_equipamiento_requerido, indicaciones, url_video }`, el sistema **debe** validar y guardar el registro asociado al `id_profesor` activo.

- **`REQ-EJE-003` (State-Driven — Condicional de Equipamiento Requerido)**:
  **MIENTRAS** el profesor active el switch `requiere_equipamiento = true`, el formulario **debe** exigir la selección de un elemento del catálogo maestro de equipamiento (`id_equipamiento_requerido NOT NULL`). Si el switch está desactivado, `id_equipamiento_requerido` debe guardarse como `NULL`.

- **`REQ-EJE-004` (Unwanted Behavior — Validación de Ejercicio)**:
  **SI** el formulario se envía sin nombre o sin grupo muscular, **ENTONCES** el sistema **debe** rechazar la solicitud con `INVALID_EXERCISE_DATA`.

- **`REQ-EJE-005` (Event-Driven — Baja Lógica de Ejercicio)**:
  **CUANDO** el profesor elimine un ejercicio del catálogo, el sistema **debe** marcarlo con `estado = false`, asegurando que no se elimine físicamente de rutinas o series históricas completadas por los alumnos.

- **`REQ-EJE-006` (Ubiquitous — Interfaz de Ejercicios del Profesor)**:
  La vista `/profesor/ejercicios` **debe** presentar:
  1. Barra superior con buscador en tiempo real, filtro selector por grupo muscular y botón "Nuevo Ejercicio".
  2. Grilla responsive de ejercicios con badge de grupo muscular, indicador visual de máquina/peso libre requerido, indicaciones técnicas desplegables y enlace directo de video (si posee `url_video`).
  3. Modal de alta/edición ágil y accesible.

---

### C. Proveedor Dual y Paridad de Contrato (`REQ-GYM-007` a `REQ-GYM-009`)

- **`REQ-GYM-007` (Ubiquitous — Paridad Estricta en Métodos de Servicio)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar exactamente:
  - `getGimnasios()`, `guardarGimnasio(gimnasio)`, `eliminarGimnasio(id)`.
  - `getEquipamientoMaestro()`.
  - `getEjercicios()`, `guardarEjercicio(ejercicio)`, `eliminarEjercicio(id)`.
  con idénticas firmas y respuestas.

- **`REQ-GYM-008` (Ubiquitous — Clean Code y SRP)**:
  Todo componente y hook **debe** respetar:
  - Ausencia de punto y coma (`;`).
  - Límite orientativo de ~40 líneas por función/componente y ~100 líneas por archivo.
  - Trazabilidad explícita `// Anchored to REQ-GYM-XXX` o `// Anchored to REQ-EJE-XXX`.

- **`REQ-GYM-009` (Ubiquitous — Cobertura de Pruebas Unitarias y en Vivo)**:
  El conjunto de pruebas automatizadas en `Vitest` **debe** verificar al 100%:
  - ABM de gimnasios y equipamiento en Mock (`gimnasiosService.test.js`).
  - ABM y filtrado de ejercicios en Mock (`ejerciciosService.test.js`).
  - Pruebas de integración reales contra Supabase en Docker (`gimnasiosEjercicios.supabase.test.js`).
  - Renderizado e interacción de vistas en React (`GimnasiosPage.test.jsx`, `EjerciciosPage.test.jsx`).

---

## 3. Criterios de Aceptación y Matriz de Trazabilidad

| REQ-ID | Descripción Corta | Artefacto Principal | Método de Verificación |
| :--- | :--- | :--- | :--- |
| `REQ-GYM-001` | Consulta de gimnasios y equipamiento | `src/services/gimnasiosService.js` | Unit test en `gimnasiosService.test.js` |
| `REQ-GYM-002` | Creación/edición atómica de gimnasio y equipos | `mockAdapter.js`, `supabaseAdapter.js` | Unit test + test en vivo Supabase |
| `REQ-GYM-003` | Validación de nombre obligatorio de gimnasio | `gimnasiosValidator.js` | Unit test `gimnasiosValidator.test.js` |
| `REQ-GYM-004` | Baja lógica de gimnasio (`estado = false`) | `gimnasiosService.js` | Unit test en `gimnasiosService.test.js` |
| `REQ-GYM-005` | Catálogo maestro de equipamiento | `gimnasiosService.js` | Unit test |
| `REQ-GYM-006` | Vista `/profesor/gimnasios` con modal de edición | `src/features/gimnasios/components/` | `GimnasiosPage.test.jsx` |
| `REQ-EJE-001` | Consulta y filtrado de ejercicios | `src/services/ejerciciosService.js` | Unit test en `ejerciciosService.test.js` |
| `REQ-EJE-002` | Alta y edición de ejercicios | `mockAdapter.js`, `supabaseAdapter.js` | Unit test + test en vivo Supabase |
| `REQ-EJE-003` | Selector condicional de máquina requerida | `EjercicioFormModal.jsx` | `EjerciciosPage.test.jsx` |
| `REQ-EJE-004` | Validación de campos obligatorios en ejercicio | `ejerciciosValidator.js` | Unit test `ejerciciosValidator.test.js` |
| `REQ-EJE-005` | Baja lógica de ejercicio (`estado = false`) | `ejerciciosService.js` | Unit test |
| `REQ-EJE-006` | Vista `/profesor/ejercicios` con buscador y chips | `src/features/ejercicios/components/` | `EjerciciosPage.test.jsx` |
| `REQ-GYM-007` | Paridad estricta entre adaptadores | `contractParity.test.js` | `npm test` & `npm run test:supabase` |
| `REQ-GYM-008` | Clean Code (~40 líneas/función, ~100 líneas/archivo) | `src/**` | Revisión estática y linter |
| `REQ-GYM-009` | Suite completa pasando en Mock y Supabase | `src/tests/*` | `npm test` & `npm run test:supabase` |
