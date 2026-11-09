# Desglose de Tareas: 005 — Constructor de Rutinas Semanales por Alumno y Día

## Estado del Modo de Entorno (`Docker Gate`)
- **Modo Activo**: **Modo B — Con Docker / Supabase Activo Ahora**.
- **Alcance de Ejecución**: Se desarrollan los servicios y componentes en `workspace/frontend/`. Se asegura paridad estricta entre `mockAdapter.js` y `supabaseAdapter.js`. Todas las pruebas unitarias en modo Mock y las pruebas de integración en vivo contra Supabase Local en Docker deben ejecutarse y pasar al 100%.

---

## Lista Secuencial de Tareas Atómicas

### Fase 1: Validadores, Asistente de Equipamiento y Capa Dual de Datos (`src/services/`)

- [x] **TASK-001** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-004`
  - **Descripción**: Crear `src/services/validators/rutinasValidator.js` para validar payload de rutinas (`id_alumno`, `numero_dia` entre 1 y 7, `nombre_rutina`, lista de ejercicios con `series_objetivo >= 1` y `repeticiones_objetivo`).
  - **Criterio de Aceptación**: Lanza error estructurado `INVALID_RUTINA_PAYLOAD` ante datos inválidos.

- [x] **TASK-002** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-006`, `REQ-RUT-007`
  - **Descripción**: Crear `src/features/rutinas/utils/equipamientoChecker.js` con la función pura `checkDisponibilidadEquipamiento(ejercicio, gimnasio)` para verificar si la máquina requerida existe en la sede del alumno.
  - **Criterio de Aceptación**: Retorna `{ disponible: boolean, mensaje: string, advertencia: boolean }` con feedback amigable.

- [x] **TASK-003** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-001`, `REQ-RUT-003`, `REQ-RUT-011`
  - **Descripción**: Extender `mockAdapter.js`, `mockAdapterQueries.js` y `mockAdapterMutations.js` con `guardarRutinaCompleta` (upsert atómico de cabecera y sincronización de ejercicios ordenados) y `eliminarRutina`.
  - **Criterio de Aceptación**: Persiste atómicamente en `localStorage` con orden secuencial e integridad referencial.

- [x] **TASK-004** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-001`, `REQ-RUT-003`, `REQ-RUT-011`
  - **Descripción**: Extender `supabaseAdapter.js` y `supabaseAdapterMutations.js` implementando exactamente el mismo contrato de `guardarRutinaCompleta` y `eliminarRutina` contra PostgreSQL con RLS.
  - **Criterio de Aceptación**: Transacción atómica en Postgres que actualiza `rutinas` y `rutina_ejercicios` respetando políticas del profesor.

- [x] **TASK-005** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-011`
  - **Descripción**: Crear la fachada unificada `src/services/rutinasService.js` consumiendo el `dataProvider` activo.
  - **Criterio de Aceptación**: Cero acoplamiento a clientes concretos en la interfaz.

---

### Fase 2: Hooks de Gestión del Constructor (`src/features/rutinas/hooks/`)

- [x] **TASK-006** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-009`
  - **Descripción**: Crear `src/features/rutinas/hooks/useCatalogoSelector.js` para administrar el catálogo de ejercicios, filtros por músculo y búsqueda en texto.
  - **Criterio de Aceptación**: Hook reactivo $\le 40$ líneas por función.

- [x] **TASK-007** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-002`, `REQ-RUT-003`, `REQ-RUT-005`, `REQ-RUT-008`
  - **Descripción**: Crear `src/features/rutinas/hooks/useConstructorRutinas.js` para gestionar el alumno activo, rutinas por día, agregado con precarga (3 series, 10-12 reps), reordenamiento secuencial y guardado.
  - **Criterio de Aceptación**: Manejo reactivo de estado sin mutaciones directas y con soporte de múltiples inserciones del mismo ejercicio.

---

### Fase 3: Componentes Visuales del Constructor (`src/features/rutinas/components/`)

- [x] **TASK-008** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-008`, `REQ-RUT-010`
  - **Descripción**: Crear `src/features/rutinas/components/ConstructorAlumnoHeader.jsx` con selector de alumno de la cartera, badge de sede, badge de días de rutina y botón con cursor pointer para ver la ficha médica.
  - **Criterio de Aceptación**: Barra informativa deportiva con navegación directa a la ficha física del alumno.

- [x] **TASK-009** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-002`, `REQ-RUT-008`
  - **Descripción**: Crear `src/features/rutinas/components/ConstructorDiasTabs.jsx` generando las pestañas correspondientes a la cantidad de días del alumno (`Día 1`, `Día 2`...).
  - **Criterio de Aceptación**: Segmented control deportivo con contador de ejercicios por día.

- [x] **TASK-010** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-005`, `REQ-RUT-006`, `REQ-RUT-008`
  - **Descripción**: Crear `src/features/rutinas/components/RutinaEjercicioItem.jsx` para la tarjeta de cada ejercicio programado, con inputs de series, repeticiones, notas, badge de advertencia preventiva de máquina y botones de orden/eliminar.
  - **Criterio de Aceptación**: Diseño deportivo pulido con feedback táctil `active:scale-95`.

- [x] **TASK-011** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-006`, `REQ-RUT-009`
  - **Descripción**: Crear `src/features/rutinas/components/CatalogoSelectorModal.jsx` con buscador, chips de músculos, indicador preventivo de máquina y botón para agregar en 1 clic.
  - **Criterio de Aceptación**: Modal ágil y accesible con advertencia preventiva si la máquina no está en la sede del alumno.

- [x] **TASK-012** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-008`
  - **Descripción**: Crear `src/features/rutinas/components/ConstructorRutinasPage.jsx` integrando la cabecera, pestañas de días, lista de ejercicios, modal de catálogo y modal de ficha médica.
  - **Criterio de Aceptación**: Vista principal montada en `/profesor/rutinas`.

---

### Fase 4: Enrutamiento (`src/app/AppRoutes.jsx`)

- [x] **TASK-013** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-008`
  - **Descripción**: Reemplazar en `src/app/AppRoutes.jsx` el placeholder de `rutinas` en el layout del profesor por `ConstructorRutinasPage`.
  - **Criterio de Aceptación**: Navegación fluida y protegida hacia `/profesor/rutinas`.

---

### Fase 5: Pruebas Automatizadas Duales (`tests/`)

- [x] **TASK-014** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-012`
  - **Descripción**: Crear `tests/rutinasService.test.js` testeando el validador, el checker de equipamiento y las operaciones de guardado y consulta de rutinas en modo Mock.
  - **Criterio de Aceptación**: Cobertura completa de casos válidos, inválidos y reordenamiento.

- [x] **TASK-015** | **Worker**: `frontend` | **Requisito**: `REQ-RUT-008`, `REQ-RUT-012`
  - **Descripción**: Crear `tests/ConstructorRutinasPage.test.jsx` testeando la selección de alumno, agregado de ejercicios del catálogo y reordenamiento.
  - **Criterio de Aceptación**: 100% aprobado en Vitest UI.

- [x] **TASK-016** | **Worker**: `backend` | **Requisito**: `REQ-RUT-011`, `REQ-RUT-012`
  - **Descripción**: Crear `tests/rutinasService.supabase.test.js` testeando la persistencia y lectura de rutinas directamente en Supabase Local con RLS.
  - **Criterio de Aceptación**: Pasa exitosamente con `npm run test:supabase`.
