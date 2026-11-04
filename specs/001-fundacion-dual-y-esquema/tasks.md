# Desglose de Tareas: 001 — Fundación Dual y Esquema Relacional Base

## Estado del Modo de Entorno (`Docker Gate`)
- **Modo Activo**: **Modo A — Sin Docker Activo Ahora (`VITE_DATA_MODE=mock`)**.
- **Alcance de Ejecución**: Se implementan al 100% tanto los archivos de `workspace/supabase/` y `supabaseAdapter.js` como `mockAdapter.js`. Las pruebas en modo Mock (`*.test.js` / `*.test.jsx`) y el build de producción se ejecutan y validan en vivo; las pruebas contra Supabase real (`*.supabase.test.js`) quedan escritas y listas con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` y el script `npm run test:supabase`.

---

## Lista Secuencial de Tareas Atómicas

### Fase 1: Backend Relacional y Semilla SQL (`workspace/supabase/`)

- [x] **TASK-001** | **Worker**: `backend` | **Requisito**: `REQ-FND-004`, `REQ-FND-005`, `REQ-FND-006`
  - **Descripción**: Crear `workspace/supabase/config.toml` y la migración `workspace/supabase/migrations/20261008000001_initial_schema.sql` con las 10 tablas del dominio (`usuarios`, `personas`, `perfil_alumno`, `gimnasios`, `equipamiento`, `gimnasio_equipamiento`, `ejercicios`, `rutinas`, `rutina_ejercicios`, `registros_rutina`, `detalle_series`), restricciones `CHECK`, claves foráneas e índices B-Tree sobre todas las columnas FK y `client_submission_id`.
  - **Criterio de Aceptación**: El archivo SQL define las 10 tablas con los nombres exactos de columnas especificados, integridad referencial `1:1` entre `usuarios -> personas -> perfil_alumno` e índices explícitos.

- [x] **TASK-002** | **Worker**: `backend` | **Requisito**: `REQ-FND-007`, `REQ-FND-008`
  - **Descripción**: Crear la migración `workspace/supabase/migrations/20261008000002_rls_and_rpc.sql` habilitando `ROW LEVEL SECURITY` en las 10 tablas, creando las funciones auxiliares `public.get_my_persona_id()` y `public.get_my_role()`, las políticas de acceso por rol (`profesor` vs `alumno`) y la función RPC transaccional e idempotente `public.guardar_entrenamiento_batch(payload jsonb)`.
  - **Criterio de Aceptación**: Todas las tablas tienen `ENABLE ROW LEVEL SECURITY`, políticas separadas para profesor y alumno, y la función `guardar_entrenamiento_batch` valida el payload, previene duplicados mediante `client_submission_id` e inserta cabecera + series en una sola transacción.

- [x] **TASK-003** | **Worker**: `backend` | **Requisito**: `REQ-FND-009`
  - **Descripción**: Crear `workspace/supabase/seed.sql` con datos semilla reproducibles (Profesor Leandro Pirro, 2 gimnasios, catálogo de equipamiento y ejercicios, 2 alumnos con `perfil_alumno`, rutinas semanales y 1 registro histórico de entrenamiento con sus series).
  - **Criterio de Aceptación**: `seed.sql` inserta registros consistentes en las 10 tablas respetando todas las claves foráneas y restricciones `CHECK`.

---

### Fase 2: Inicialización del Proyecto Frontend y Sistema de Diseño (`workspace/frontend/`)

- [x] **TASK-004** | **Worker**: `frontend` | **Requisito**: `REQ-FND-001`, `REQ-FND-002`
  - **Descripción**: Inicializar `workspace/frontend/` con React 19, Vite 8, Tailwind CSS v4, `shadcn/ui` (`components.json`), `lucide-react`, `@supabase/supabase-js` y `Vitest` (`jsdom` + `@testing-library/react`), configurando el alias `@/` hacia `src/` y los scripts `dev`, `build`, `test` y `test:supabase`.
  - **Criterio de Aceptación**: `package.json`, `vite.config.js`, `components.json` y `.env.example` existen y están correctamente configurados; las dependencias se instalan sin errores.

- [x] **TASK-005** | **Worker**: `frontend` | **Requisito**: `REQ-FND-001`, `REQ-FND-002`
  - **Descripción**: Configurar `src/index.css` con los tokens semánticos de las paletas aprobadas: **Opción A (Turquesa Acero & Grafito: `#111418`, `#1B2026`, `#252C34`, `#00C2CB`, `#5CE1E6`, `#C4CDD5`)** como tema oscuro principal y **Opción C (Titanio Plateado & Turquesa Profundo: `#E5E9EC`, `#F4F6F8`, `#121619`, `#008B94`, `#00ADB5`, `#9EA8B3`)** como tema claro, junto con los componentes base de `shadcn/ui` (`Button`, `Card`, `Badge`, `Tabs`, `Alert`, `Separator`).
  - **Criterio de Aceptación**: Los componentes en `src/components/ui/` siguen las reglas de `shadcn` (uso de `gap-*`, `size-*`, `data-icon`, tokens semánticos y funciones $\le 40$ líneas sin `;`).

---

### Fase 3: Capa de Servicios, Proveedor Dual y Hook Offline-First (`src/services/` & `src/features/training/`)

- [x] **TASK-006** | **Worker**: `frontend` | **Requisito**: `REQ-FND-009`, `REQ-FND-012`
  - **Descripción**: Crear `src/services/seed/mockSeedData.js` (espejo exacto de `workspace/supabase/seed.sql`) y el validador compartido `src/services/validators/trainingBatchValidator.js`.
  - **Criterio de Aceptación**: `mockSeedData.js` expone `createInitialMockDb()` con las 10 colecciones relacionales y los mismos IDs/columnas que `seed.sql`; `validateTrainingBatchPayload` rechaza payloads incompletos con `INVALID_BATCH_PAYLOAD`.

- [x] **TASK-007** | **Worker**: `frontend` | **Requisito**: `REQ-FND-010`, `REQ-FND-011`, `REQ-FND-012`
  - **Descripción**: Implementar `src/services/adapters/mockAdapter.js`, `src/services/supabaseClient.js`, `src/services/adapters/supabaseAdapter.js` y el selector `src/services/dataProvider.js` con paridad estricta de métodos y contratos.
  - **Criterio de Aceptación**: Ambos adaptadores exponen exactamente las mismas funciones (`getSystemStatusSummary`, `getAlumnos`, `getGimnasios`, `getEjercicios`, `getRutinasByAlumno`, `guardarEntrenamientoBatch`, `resetMockDatabase`) devolviendo estructuras idénticas.

- [x] **TASK-008** | **Worker**: `frontend` | **Requisito**: `REQ-FND-013`
  - **Descripción**: Implementar el hook `src/features/training/hooks/useRoutineLocalStorage.js` para gestionar el borrador local de series (`pirro_draft_${idAlumno}_${idRutina}`) con 0 llamadas de red durante la carga y envío único idempotente (`commitBatch`) al presionar Guardar.
  - **Criterio de Aceptación**: `saveSerieDraft` persiste instantáneamente en `localStorage` sin invocar al adaptador; `commitBatch` envía todas las series con el mismo `clientSubmissionId` y solo borra el borrador local tras recibir `{ ok: true }`.

---

### Fase 4: Interfaz Fundacional de Verificación y `DevDataToolbar` (`src/components/dev/` & `src/features/foundation/`)

- [x] **TASK-009** | **Worker**: `frontend` | **Requisito**: `REQ-FND-003`, `REQ-FND-014`
  - **Descripción**: Implementar `src/components/dev/DevDataToolbar.jsx` (píldora flotante discreta y colapsable en la esquina inferior derecha para alternar `MOCK LOCAL` $\leftrightarrow$ `SUPABASE` y restaurar semilla) y el Tablero de Verificación Fundacional (`FoundationDashboard.jsx`, `RelationalEntityCard.jsx`, `BatchSyncSandbox.jsx`) integrado en `App.jsx` con selector de tema Oscuro (Opción A) / Claro (Opción C).
  - **Criterio de Aceptación**: Ningún componente importa `@supabase/supabase-js` ni accede directamente a `pirro_mock_db_v1`; el tablero muestra los alumnos, gimnasios, ejercicios y permite probar en vivo el borrador local y el guardado batch.

---

### Fase 5: Refactorización Clean Code, Pruebas Duales y Validación (`/refactor`, `/test`, `/sdd-validate`)

- [x] **TASK-010** | **Worker**: `frontend` & `backend` | **Requisito**: `REQ-FND-002`, `REQ-FND-015`, `REQ-FND-016`
  - **Descripción**: Ejecutar revisión `/refactor` (verificando funciones $\le 40$ líneas, archivos $\le 100$ líneas y código sin `;`), crear la suite de pruebas en `src/tests/` (`dataProvider.test.js`, `mockAdapter.test.js`, `contractParity.test.js`, `useRoutineLocalStorage.test.js`, `FoundationDashboard.test.jsx` y `supabaseAdapter.supabase.test.js` con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`) y validar con `npm run test` y `npm run build`.
  - **Criterio de Aceptación**: `npm run build` compila con 0 errores y `npm run test` pasa el 100% de las pruebas activas en modo Mock dejando las pruebas de Supabase listas para ejecutarse con `npm run test:supabase`.
