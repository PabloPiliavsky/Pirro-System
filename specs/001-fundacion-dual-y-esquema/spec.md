# Especificación de Requisitos: 001 — Fundación Dual y Esquema Relacional Base

## 1. Propósito y Alcance
Establecer los cimientos técnicos, visuales y de datos de **Pirro-System** en dos frentes sincronizados:
1. **Frontend (`workspace/frontend/`)**: Aplicación React 19 + Vite 8 + Tailwind CSS v4 + `shadcn/ui` + `Vitest`, con desacoplamiento total de la capa de datos mediante el **Proveedor Dual** (`mockAdapter` persistido en `localStorage` $\leftrightarrow$ `supabaseAdapter` conectado a PostgreSQL/PostgREST/RPC) y la barra flotante de desarrollo (`DevDataToolbar`).
2. **Backend Relacional (`workspace/supabase/`)**: Configuración declarativa de Supabase CLI, migraciones SQL del modelo completo (`usuarios` $\rightarrow$ `personas` $\rightarrow$ `perfil_alumno`, `gimnasios`, `equipamiento`, `gimnasio_equipamiento`, `ejercicios`, `rutinas`, `rutina_ejercicios`, `registros_rutina`, `detalle_series`), políticas **Row Level Security (RLS)** por rol (`profesor` vs `alumno`), función transaccional idempotente `guardar_entrenamiento_batch` y datos semilla (`seed.sql`).

### Modo de Entorno Confirmado (Docker Gate)
- **Modo A — Sin Docker Activo Ahora**:
  - Todas las pruebas unitarias, de UI y de paridad en modo Mock se ejecutan y validan inmediatamente con `npm run test` y `npm run build` (`VITE_DATA_MODE=mock`).
  - Todos los artefactos de `workspace/supabase/` (migraciones, RLS, RPC, `seed.sql`), el `supabaseAdapter.js` y la suite de integración `*.supabase.test.js` (con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` y script `npm run test:supabase`) quedan **100% escritos, estructurados y listos** para ejecutarse en cuanto se disponga de Docker o conexión a un proyecto Supabase.

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Inicialización del Frontend y Estándar de Código (`REQ-FND-001` a `REQ-FND-003`)

- **`REQ-FND-001` (Ubiquitous — Stack Base)**:
  El sistema **debe** inicializar el proyecto frontend en `workspace/frontend/` utilizando React 19 (`.js`/`.jsx` con ES Modules), Vite 8, Tailwind CSS v4, `shadcn/ui`, `lucide-react` y `Vitest` con `@testing-library/react`, configurando el alias de importación `@/` hacia `src/`.
- **`REQ-FND-002` (Ubiquitous — Clean Code y Modularización)**:
  El sistema **debe** estructurar el código fuente bajo `src/features/`, `src/services/`, `src/components/ui/` y `src/lib/`, respetando el principio de responsabilidad única (SRP) con un límite orientativo de ~40 líneas por función/componente, ~100 líneas por archivo y estilo sin punto y coma (`;`).
- **`REQ-FND-003` (Ubiquitous — Prohibición de Acoplamiento Directo)**:
  Ningún componente visual o hook de UI en `src/features/` o `src/components/` **debe** importar directamente `@supabase/supabase-js` ni leer o escribir claves crudas del `localStorage` de la base de datos mock; toda interacción de datos debe canalizarse a través de `src/services/`.

---

### B. Esquema Relacional PostgreSQL en `workspace/supabase/` (`REQ-FND-004` a `REQ-FND-009`)

- **`REQ-FND-004` (Ubiquitous — Cadena de Identidad `usuarios` $\rightarrow$ `personas` $\rightarrow$ `perfil_alumno`)**:
  El esquema SQL en `workspace/supabase/migrations/` **debe** definir la separación estricta en tres niveles:
  1. `public.usuarios`: `id` (BIGSERIAL PK), `auth_user_id` (UUID UNIQUE nullable/vinculado a `auth.users`), `nombre_usuario` (VARCHAR UNIQUE NOT NULL), `email` (VARCHAR UNIQUE NOT NULL), `password_hash` (TEXT), `estado` (BOOLEAN DEFAULT true), `ultimo_acceso` (TIMESTAMPTZ), `created_at` (TIMESTAMPTZ).
  2. `public.personas`: `id` (BIGSERIAL PK), `id_usuario` (BIGINT UNIQUE NOT NULL FK $\rightarrow$ `usuarios.id` ON DELETE CASCADE), `rol` (VARCHAR CHECK `rol IN ('profesor', 'alumno')` NOT NULL), `nombre` (VARCHAR NOT NULL), `apellido` (VARCHAR NOT NULL), `fecha_nacimiento` (DATE), `telefono` (VARCHAR), `url_foto` (TEXT), `estado` (BOOLEAN DEFAULT true), `created_at` (TIMESTAMPTZ).
  3. `public.perfil_alumno`: `id_persona` (BIGINT PK FK $\rightarrow$ `personas.id` ON DELETE CASCADE), `id_profesor` (BIGINT NOT NULL FK $\rightarrow$ `personas.id`), `id_gimnasio` (BIGINT FK $\rightarrow$ `gimnasios.id`), `altura_cm` ( NUMERIC(5,2)), `peso_kg` (NUMERIC(5,2)), `salud_enfermedades` (TEXT), `fecha_ingreso` (DATE DEFAULT CURRENT_DATE), `cantidad_dias_rutina` (SMALLINT CHECK `cantidad_dias_rutina BETWEEN 1 AND 7` DEFAULT 3), `comentario` (TEXT).
- **`REQ-FND-005` (Ubiquitous — Gimnasios, Equipamiento y Catálogo de Ejercicios)**:
  El esquema SQL **debe** definir las tablas:
  1. `public.gimnasios`: `id` (BIGSERIAL PK), `id_profesor` (BIGINT NOT NULL FK $\rightarrow$ `personas.id`), `nombre` (VARCHAR NOT NULL), `direccion` (VARCHAR), `horario_apertura` (TIME), `horario_cierre` (TIME), `estado` (BOOLEAN DEFAULT true).
  2. `public.equipamiento`: `id` (BIGSERIAL PK), `nombre` (VARCHAR NOT NULL), `categoria` (VARCHAR CHECK `categoria IN ('maquina', 'peso_libre', 'accesorio', 'cardio')` NOT NULL), `descripcion` (TEXT).
  3. `public.gimnasio_equipamiento`: `id` (BIGSERIAL PK), `id_gimnasio` (BIGINT NOT NULL FK $\rightarrow$ `gimnasios.id` ON DELETE CASCADE), `id_equipamiento` (BIGINT NOT NULL FK $\rightarrow$ `equipamiento.id` ON DELETE CASCADE), `cantidad` (SMALLINT DEFAULT 1), `observaciones` (TEXT), `estado` (BOOLEAN DEFAULT true), con restricción `UNIQUE (id_gimnasio, id_equipamiento)`.
  4. `public.ejercicios`: `id` (BIGSERIAL PK), `id_profesor` (BIGINT NOT NULL FK $\rightarrow$ `personas.id`), `nombre` (VARCHAR NOT NULL), `grupo_muscular` (VARCHAR NOT NULL), `requiere_equipamiento` (BOOLEAN DEFAULT false), `id_equipamiento_requerido` (BIGINT nullable FK $\rightarrow$ `equipamiento.id`), `indicaciones` (TEXT), `url_video` (TEXT), `estado` (BOOLEAN DEFAULT true).
- **`REQ-FND-006` (Ubiquitous — Rutinas Semanales y Registros de Entrenamiento)**:
  El esquema SQL **debe** definir las tablas de planificación y ejecución:
  1. `public.rutinas`: `id` (BIGSERIAL PK), `id_alumno` (BIGINT NOT NULL FK $\rightarrow$ `perfil_alumno.id_persona` ON DELETE CASCADE), `id_profesor` (BIGINT NOT NULL FK $\rightarrow$ `personas.id`), `numero_dia` (SMALLINT NOT NULL CHECK `numero_dia BETWEEN 1 AND 7`), `nombre_rutina` (VARCHAR NOT NULL), `activa` (BOOLEAN DEFAULT true), `created_at` (TIMESTAMPTZ).
  2. `public.rutina_ejercicios`: `id` (BIGSERIAL PK), `id_rutina` (BIGINT NOT NULL FK $\rightarrow$ `rutinas.id` ON DELETE CASCADE), `id_ejercicio` (BIGINT NOT NULL FK $\rightarrow$ `ejercicios.id`), `orden` (SMALLINT NOT NULL), `series_objetivo` (SMALLINT NOT NULL CHECK `series_objetivo >= 1`), `repeticiones_objetivo` (VARCHAR NOT NULL), `notas_profesor` (TEXT).
  3. `public.registros_rutina`: `id` (BIGSERIAL PK), `client_submission_id` (UUID UNIQUE NOT NULL), `id_alumno` (BIGINT NOT NULL FK $\rightarrow$ `perfil_alumno.id_persona`), `id_rutina` (BIGINT NOT NULL FK $\rightarrow$ `rutinas.id`), `fecha_realizacion` (DATE NOT NULL DEFAULT CURRENT_DATE), `created_at` (TIMESTAMPTZ DEFAULT now()).
  4. `public.detalle_series`: `id` (BIGSERIAL PK), `id_registro_rutina` (BIGINT NOT NULL FK $\rightarrow$ `registros_rutina.id` ON DELETE CASCADE), `id_ejercicio` (BIGINT NOT NULL FK $\rightarrow$ `ejercicios.id`), `numero_serie` (SMALLINT NOT NULL CHECK `numero_serie >= 1`), `repeticiones_objetivo` (VARCHAR), `repeticiones_realizadas` (SMALLINT NOT NULL CHECK `repeticiones_realizadas >= 0`), `peso_utilizado` (NUMERIC(6,2) NOT NULL CHECK `peso_utilizado >= 0`), `comentario_alumno` (TEXT).
- **`REQ-FND-007` (Ubiquitous — Seguridad RLS Obligatoria e Índices)**:
  El esquema SQL **debe** habilitar `ROW LEVEL SECURITY` en el 100% de las tablas de `public`, crear índices sobre todas las claves foráneas y proveer las funciones `public.get_my_persona_id()` y `public.get_my_role()` (`SECURITY DEFINER STABLE`) de modo que:
  - Un usuario con `rol = 'profesor'` tenga acceso completo de lectura y escritura sobre su cartera, gimnasios, equipamiento, catálogo de ejercicios, rutinas e historial de sus alumnos.
  - Un usuario con `rol = 'alumno'` solo pueda leer su propio registro en `usuarios`, `personas`, `perfil_alumno`, sus `rutinas` activas, el catálogo de `ejercicios` asociado y leer/crear únicamente sus propios `registros_rutina` y `detalle_series`.
- **`REQ-FND-008` (Event-Driven — RPC Transaccional Idempotente `guardar_entrenamiento_batch`)**:
  **CUANDO** se invoca `public.guardar_entrenamiento_batch(payload jsonb)` con `{ clientSubmissionId, idAlumno, idRutina, fechaRealizacion, series }`, la base de datos **debe** verificar primero si `client_submission_id` ya existe en `registros_rutina`; si existe, **debe** retornar `{ ok: true, idRegistro, idempotent: true }` sin duplicar filas, y si no existe, **debe** insertar la cabecera en `registros_rutina` y todas las filas de `series` en `detalle_series` en una única transacción atómica retornando `{ ok: true, idRegistro, idempotent: false }`.
- **`REQ-FND-009` (Ubiquitous — Datos Semilla Reproducibles en `seed.sql` y Mock)**:
  Tanto `workspace/supabase/seed.sql` como el dataset inicial de `mockAdapter` **deben** contener el mismo conjunto coherente de datos semilla para el profesor **Leandro Pirro** (`rol = 'profesor'`), al menos 2 gimnasios con equipamiento variado, un catálogo base de ejercicios (con y sin requerimiento de máquina), al menos 2 alumnos con `perfil_alumno` completo, rutinas semanales de múltiples días y al menos 1 registro histórico de entrenamiento con sus series detalladas.

---

### C. Proveedor Dual de Datos y Sincronización Local (`REQ-FND-010` a `REQ-FND-014`)

- **`REQ-FND-010` (Ubiquitous — Selector Dinámico `dataProvider.js`)**:
  El servicio `src/services/dataProvider.js` **debe** exponer `getActiveDataMode()`, `setDevDataMode(mode)` y `getProvider()`, seleccionando entre `mockAdapter` y `supabaseAdapter` según `import.meta.env.VITE_DATA_MODE` (por defecto `'mock'`) o la preferencia activa en `localStorage` (`pirro_dev_data_mode`) cuando `import.meta.env.DEV` es verdadero.
- **`REQ-FND-011` (Ubiquitous — Paridad Estricta de Contrato entre Adaptadores)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar exactamente los mismos métodos asíncronos y devolver objetos con los mismos nombres de columnas del modelo relacional SQL (`id`, `nombre_usuario`, `id_usuario`, `id_persona`, `id_profesor`, `id_gimnasio`, `series_objetivo`, `repeticiones_objetivo`, etc.) para:
  - `getSystemStatusSummary()`: conteo de gimnasios, ejercicios, alumnos activos, rutinas y sesiones registradas, más los datos del profesor y listado resumido de entidades semilla.
  - `getAlumnos()`, `getGimnasios()`, `getEjercicios()`, `getRutinasByAlumno(idAlumno)`.
  - `guardarEntrenamientoBatch(payload)`: validación del payload, verificación de idempotencia por `clientSubmissionId` e inserción atómica de cabecera + series.
  - `resetMockDatabase()` (en `mockAdapter`, restaura `pirro_mock_db_v1` a la semilla original; en `supabaseAdapter`, retorna un aviso controlado indicando que el reset de base de datos en vivo se realiza vía CLI).
- **`REQ-FND-012` (Unwanted Behavior — Validación de Payload en `guardarEntrenamientoBatch`)**:
  **SI** se invoca `guardarEntrenamientoBatch(payload)` sin `clientSubmissionId`, sin `idAlumno`, sin `idRutina` o con un arreglo `series` vacío, **ENTONCES** el adaptador activo **debe** rechazar la operación devolviendo `{ ok: false, error: { code: 'INVALID_BATCH_PAYLOAD', message: '...' } }` sin modificar `registros_rutina` ni `detalle_series`.
- **`REQ-FND-013` (State-Driven — Hook Fundacional `useRoutineLocalStorage`)**:
  **MIENTRAS** un alumno edita series de una sesión en curso, el hook `useRoutineLocalStorage(idAlumno, idRutina)` **debe** persistir instantáneamente cada serie en `localStorage` bajo la clave `pirro_draft_${idAlumno}_${idRutina}` generando un `clientSubmissionId` único (`crypto.randomUUID()`), sin realizar llamadas al adaptador de datos hasta que se ejecute explícitamente la acción de guardado final por lote (`commitBatch`), la cual solo limpia el borrador local si el adaptador confirma `{ ok: true }`.
- **`REQ-FND-014` (Optional Feature — Barra Flotante de Desarrollo `DevDataToolbar` y Vista de Diagnóstico Fundacional)**:
  **DONDE** la aplicación se ejecute en entorno de desarrollo (`import.meta.env.DEV === true`), el sistema **debe** renderizar el componente `DevDataToolbar` (que permite alternar en 1 clic entre `MOCK LOCAL` y `SUPABASE`, visualizar el estado de conexión y ejecutar **"Restaurar Semilla Mock"**) junto con un **Panel Fundacional de Estado del Sistema** que evidencie en vivo los datos relacionales cargados (`usuarios` $\rightarrow$ `personas` $\rightarrow$ `perfil_alumno`, gimnasios, ejercicios, rutinas y simulador de prueba de guardado batch idempotente).

---

### D. Estrategia de Pruebas Dual Sin Docker (`REQ-FND-015` a `REQ-FND-016`)

- **`REQ-FND-015` (Ubiquitous — Suite Ejecutable en Modo Mock)**:
  El comando `npm run test` en `workspace/frontend/` **debe** ejecutar sin requerir Docker ni conexión de red las pruebas unitarias, de UI y de contrato en `Vitest` verificando:
  1. Inicialización y restauración de la base de datos semilla en `mockAdapter` (`REQ-FND-009`, `REQ-FND-011`).
  2. Idempotencia y atomicidad de `guardarEntrenamientoBatch` ante reintentos con el mismo `clientSubmissionId` y rechazo ante payloads inválidos (`REQ-FND-008`, `REQ-FND-012`).
  3. Ciclo completo del hook `useRoutineLocalStorage` (0 llamadas al adaptador al cargar series individuales, persistencia en `localStorage`, envío único al confirmar y preservación del borrador si falla el guardado) (`REQ-FND-013`).
  4. Renderizado e interacción de `DevDataToolbar` y del panel fundacional (`REQ-FND-010`, `REQ-FND-014`).
- **`REQ-FND-016` (Ubiquitous — Suite de Integración y Paridad de Supabase Preparada)**:
  El proyecto **debe** incluir los archivos de prueba `*.supabase.test.js` encapsulados con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` y el script `"test:supabase": "cross-env RUN_SUPABASE_TESTS=true vitest run"` (o equivalente compatible multiplataforma en Node), de modo que `npm run test` los omita limpiamente cuando se trabaja sin Docker, y `npm run test:supabase` los ejecute contra Supabase real verificando la paridad de contratos y la RPC `guardar_entrenamiento_batch`.

---

## 3. Criterios de Aceptación y Trazabilidad

| REQ-ID | Descripción Corta | Artefacto Principal | Método de Verificación |
| :--- | :--- | :--- | :--- |
| `REQ-FND-001` | Stack React 19 + Vite 8 + Tailwind v4 + shadcn + Vitest | `workspace/frontend/package.json`, `vite.config.js` | `npm run build` & `npm run test` |
| `REQ-FND-002` | Clean Code (~40 líneas/función, ~100 líneas/archivo, sin `;`) | `workspace/frontend/src/**` | Revisión `/refactor` + build |
| `REQ-FND-003` | Cero acoplamiento directo a Supabase/localStorage en UI | `workspace/frontend/src/features/**` | Test estático / inspección de imports |
| `REQ-FND-004` | Tablas `usuarios` -> `personas` -> `perfil_alumno` | `workspace/supabase/migrations/20261008000001_initial_schema.sql` | Validación SQL + `supabase.test.js` |
| `REQ-FND-005` | Tablas `gimnasios`, `equipamiento`, `ejercicios` | `workspace/supabase/migrations/20261008000001_initial_schema.sql` | Validación SQL + `supabase.test.js` |
| `REQ-FND-006` | Tablas `rutinas`, `rutina_ejercicios`, `registros_rutina`, `detalle_series` | `workspace/supabase/migrations/20261008000001_initial_schema.sql` | Validación SQL + `supabase.test.js` |
| `REQ-FND-007` | RLS en todas las tablas + funciones `get_my_role()` / `get_my_persona_id()` | `workspace/supabase/migrations/20261008000002_rls_and_rpc.sql` | Validación SQL + `supabase.test.js` |
| `REQ-FND-008` | Función RPC transaccional e idempotente `guardar_entrenamiento_batch` | `workspace/supabase/migrations/20261008000002_rls_and_rpc.sql` | Unit test Mock + `supabase.test.js` |
| `REQ-FND-009` | Semilla coherente en `seed.sql` y `mockSeedData.js` | `workspace/supabase/seed.sql`, `src/services/seed/mockSeedData.js` | Test de paridad de estructura semilla |
| `REQ-FND-010` | Selector `dataProvider.js` (`mock` <-> `supabase` + override DEV) | `src/services/dataProvider.js` | `dataProvider.test.js` |
| `REQ-FND-011` | Paridad estricta de métodos y columnas entre adaptadores | `src/services/adapters/mockAdapter.js`, `supabaseAdapter.js` | `contractParity.test.js` |
| `REQ-FND-012` | Rechazo de payload inválido en `guardarEntrenamientoBatch` | `mockAdapter.js`, `supabaseAdapter.js` | `batchSave.test.js` |
| `REQ-FND-013` | Hook `useRoutineLocalStorage` (0 red por serie + guardado batch) | `src/features/training/hooks/useRoutineLocalStorage.js` | `useRoutineLocalStorage.test.js` |
| `REQ-FND-014` | `DevDataToolbar` + Panel Fundacional de Diagnóstico en UI | `src/components/dev/DevDataToolbar.jsx`, `src/features/foundation/` | `DevDataToolbar.test.jsx` |
| `REQ-FND-015` | Suite completa en modo Mock pasando al 100% sin Docker | `src/**/__tests__/*.test.{js,jsx}` | `npm run test` |
| `REQ-FND-016` | Suite `*.supabase.test.js` preparada con `skipIf` | `src/**/__tests__/*.supabase.test.js` | `npm run test` (skipped) / `npm run test:supabase` |
