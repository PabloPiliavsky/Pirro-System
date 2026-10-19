# Reporte de Síntesis: Feature 001 — Fundación Dual y Esquema Relacional Base

- **Fecha de Certificación**: 2026-10-08
- **Modo de Entorno Activo (Docker Gate)**: **Modo A — Sin Docker Activo Ahora (`VITE_DATA_MODE=mock`)**.
- **Resultado de Compilación (`npm run build`)**: **EXITOSO** (0 errores, bundle generado en `dist/`).
- **Resultado de Pruebas (`npm run test`)**: **15 passed, 2 skipped** (100% de tests en modo Mock exitosos; tests de Supabase omitidos limpiamente con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`).

---

## 1. Artefactos Implementados y Trazabilidad a Requisitos

### Backend Relacional (`workspace/supabase/`)
1. [`config.toml`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/supabase/config.toml): Configuración local de Supabase CLI para cuando se disponga de Docker.
2. [`migrations/20261008000001_initial_schema.sql`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/supabase/migrations/20261008000001_initial_schema.sql) (`REQ-FND-004`, `REQ-FND-005`, `REQ-FND-006`):
   - Jerarquía 1:1:1: `usuarios` $\rightarrow$ `personas` (con `rol IN ('profesor', 'alumno')`) $\rightarrow$ `perfil_alumno`.
   - Entorno físico: `gimnasios`, `equipamiento`, `gimnasio_equipamiento` (con `UNIQUE(id_gimnasio, id_equipamiento)`).
   - Planificación y catálogo: `ejercicios`, `rutinas`, `rutina_ejercicios`.
   - Transacciones y series: `registros_rutina` (con `client_submission_id UUID UNIQUE NOT NULL`), `detalle_series`.
   - Índices B-Tree en el 100% de las claves foráneas.
3. [`migrations/20261008000002_rls_and_rpc.sql`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/supabase/migrations/20261008000002_rls_and_rpc.sql) (`REQ-FND-007`, `REQ-FND-008`, `REQ-FND-012`):
   - Funciones `get_my_persona_id()` y `get_my_role()` (`SECURITY DEFINER STABLE`).
   - RLS obligatorio en las 10 tablas con políticas diferenciadas por rol.
   - Función RPC transaccional e idempotente `guardar_entrenamiento_batch(payload jsonb)`.
4. [`seed.sql`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/supabase/seed.sql) (`REQ-FND-009`):
   - Datos reproducibles: Profesor Leandro Pirro, 2 alumnos (Martín Gómez y Lucía Fernández), 2 gimnasios, catálogo de equipamiento y ejercicios, rutinas semanales y 1 sesión histórica con 6 series.

### Frontend y Proveedor Dual (`workspace/frontend/`)
1. **Configuración y Stack Base** (`REQ-FND-001`, `REQ-FND-002`):
   - React 19 + Vite + Tailwind CSS v4 + `shadcn/ui` + `Vitest`.
   - [`index.css`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/index.css): Sistema dual de tokens con **Opción A (Turquesa Acero & Grafito: `#111418`, `#1B2026`, `#00C2CB`, `#C4CDD5`)** como tema oscuro principal y **Opción C (Titanio Plateado & Turquesa Profundo)** como tema claro.
2. **Capa de Servicios y Paridad Estricta** (`REQ-FND-003`, `REQ-FND-010`, `REQ-FND-011`, `REQ-FND-012`):
   - [`mockAdapter.js`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/services/adapters/mockAdapter.js) persistido en `localStorage` (`pirro_mock_db_v1`) y reseteable.
   - [`supabaseAdapter.js`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/services/adapters/supabaseAdapter.js) preparado con consultas PostgREST y llamada RPC a `guardar_entrenamiento_batch`.
   - [`dataProvider.js`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/services/dataProvider.js) con selector dinámico y override en `localStorage` (`pirro_dev_data_mode`).
   - [`trainingBatchValidator.js`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/services/validators/trainingBatchValidator.js) con validación compartida y defensiva.
3. **Optimización Offline-First del Alumno** (`REQ-FND-013`):
   - [`useRoutineLocalStorage.js`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/features/training/hooks/useRoutineLocalStorage.js): Cero llamadas de red por serie, persistencia instantánea en `localStorage` (`pirro_draft_${idAlumno}_${idRutina}`) y guardado por lote (`commitBatch`) con `clientSubmissionId` para idempotencia.
4. **Interfaz y Herramienta de Desarrollo** (`REQ-FND-014`):
   - [`DevDataToolbar.jsx`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/components/dev/DevDataToolbar.jsx): Píldora flotante colapsable en la esquina inferior derecha para alternar `MOCK LOCAL` $\leftrightarrow$ `SUPABASE` y restaurar semilla.
   - [`FoundationDashboard.jsx`](file:///c:/Users/pablo/Desktop/personal/Pirro-System/workspace/frontend/src/features/foundation/components/FoundationDashboard.jsx): Tablero de verificación con telemetría de datos iniciales, cambio de tema Claro/Oscuro y sandbox de guardado batch.

---

## 2. Auditoría de Pruebas y Paridad

| Archivo de Prueba | REQ-IDs Anclados | Estado en Modo Mock |
| :--- | :--- | :--- |
| `src/tests/dataProvider.test.js` | `REQ-FND-010`, `REQ-FND-015` | **PASSED (3/3)** |
| `src/tests/mockAdapter.test.js` | `REQ-FND-004`, `REQ-FND-005`, `REQ-FND-006`, `REQ-FND-008`, `REQ-FND-009`, `REQ-FND-011`, `REQ-FND-012`, `REQ-FND-015` | **PASSED (5/5)** |
| `src/tests/contractParity.test.js` | `REQ-FND-011`, `REQ-FND-012`, `REQ-FND-015` | **PASSED (2/2)** |
| `src/tests/useRoutineLocalStorage.test.js` | `REQ-FND-013`, `REQ-FND-015` | **PASSED (3/3)** |
| `src/tests/FoundationDashboard.test.jsx` | `REQ-FND-003`, `REQ-FND-014`, `REQ-FND-015` | **PASSED (2/2)** |
| `src/tests/supabaseAdapter.supabase.test.js` | `REQ-FND-004`, `REQ-FND-007`, `REQ-FND-008`, `REQ-FND-011`, `REQ-FND-016` | **SKIPPED (2/2 preparados para `npm run test:supabase`)** |

---

## 3. Verificación de Cumplimiento de la Constitución

- **Constitución I.1, I.2 & I.3**: React 19 + Vite + Tailwind v4 + shadcn + esquema SQL con RLS/RPC en `workspace/supabase/` + Proveedor Dual sin acoplamiento de componentes UI.
- **Constitución I.4**: Modularización por features (`src/features/foundation/`, `src/features/training/`), funciones con un promedio inferior a 35 líneas, archivos menores a 100 líneas y estilo estricto sin punto y coma (`;`).
- **Constitución II.1, II.2 & II.3**: Cadena relacional 1:1:1 implementada y verificada; cero llamadas a la base de datos por serie en el hook del alumno; guardado batch idempotente.
- **Constitución IV.1**: Docker Gate respetado al 100% (validación en Mock activa, archivos SQL y suite de integración de Supabase completamente preparados).
