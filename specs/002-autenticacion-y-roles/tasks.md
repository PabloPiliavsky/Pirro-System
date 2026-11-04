# Desglose de Tareas: 002 — Autenticación Unificada, Roles y Layouts Protegidos

## Estado del Modo de Entorno (`Docker Gate`)
- **Modo Activo**: **Modo A — Sin Docker Activo Ahora (`VITE_DATA_MODE=mock`)**.
- **Alcance de Ejecución**: Se implementan al 100% tanto los adaptadores de autenticación (`mockAuthAdapter.js` y `supabaseAuthAdapter.js`) como la migración SQL en `workspace/supabase/migrations/20261009000001_auth_helpers.sql`. Las pruebas en modo Mock (`*.test.js` / `*.test.jsx`) y el build de producción se ejecutan y validan en vivo; las pruebas contra Supabase real (`authAdapter.supabase.test.js`) quedan escritas y listas con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`.

---

## Lista Secuencial de Tareas Atómicas

### Fase 1: Backend y Soporte Supabase Auth (`workspace/supabase/`)

- [x] **TASK-001** | **Worker**: `backend` | **Requisito**: `REQ-AUTH-001`, `REQ-AUTH-015`
  - **Descripción**: Crear la migración `workspace/supabase/migrations/20261009000001_auth_helpers.sql` con la función `public.resolve_user_email_by_identifier(text)` (`SECURITY DEFINER`) para permitir resolver el email de un usuario a partir de su `nombre_usuario` de forma segura durante el inicio de sesión.
  - **Criterio de Aceptación**: La función devuelve el email correspondiente si el usuario existe y está activo, o `NULL` si no existe o está deshabilitado.

---

### Fase 2: Servicios de Autenticación Dual y Paridad de Contrato (`src/services/`)

- [x] **TASK-002** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-001`, `REQ-AUTH-002`, `REQ-AUTH-003`, `REQ-AUTH-004`, `REQ-AUTH-005`
  - **Descripción**: Implementar `src/services/adapters/mockAuthAdapter.js` con soporte para login unificado (email o `nombre_usuario`), validación de cuentas activas (`usuarios.estado` y `personas.estado`), persistencia de sesión en `localStorage` (`pirro_auth_session`), actualización de `ultimo_acceso`, `logout()`, `getCurrentSession()` y emisor de eventos `onAuthStateChange()`.
  - **Criterio de Aceptación**: Pasan las pruebas unitarias de login por email y username, rechazo de cuentas inactivas con `ACCOUNT_INACTIVE` y rechazo de credenciales inválidas con `INVALID_CREDENTIALS`.

- [x] **TASK-003** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-002`, `REQ-AUTH-015`
  - **Descripción**: Implementar `src/services/adapters/supabaseAuthAdapter.js` respetando el mismo contrato que `mockAuthAdapter`, utilizando `getSupabaseClient()` para resolución de identificador y `supabase.auth.signInWithPassword`, consulta de persona vinculada y `signOut()`.
  - **Criterio de Aceptación**: Expone exactamente los mismos métodos y firma de respuestas que `mockAuthAdapter`.

- [x] **TASK-004** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-002`
  - **Descripción**: Implementar `src/services/authService.js` como fachada unificada que delega en el adaptador activo (`getActiveDataMode() === 'supabase' ? supabaseAuthAdapter : mockAuthAdapter`).
  - **Criterio de Aceptación**: Los componentes pueden importar únicamente `authService` sin acoplarse al adaptador concreto.

---

### Fase 3: Contexto de Autenticación, Rutas y Guards (`src/features/auth/` & `src/app/`)

- [x] **TASK-005** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-006`
  - **Descripción**: Implementar `src/features/auth/context/AuthContext.jsx` con el proveedor `AuthProvider` y el hook `useAuth()`, gestionando estados `{ user, session, role, isAuthenticated, isLoading, login, logout }`.
  - **Criterio de Aceptación**: `useAuth()` expone el estado de sesión de forma reactiva y maneja correctamente la hidratación inicial sin parpadeos.

- [x] **TASK-006** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-007`, `REQ-AUTH-008`
  - **Descripción**: Implementar `src/app/routes/ProtectedRoute.jsx` verificando autenticación y roles permitidos (`allowedRoles`).
  - **Criterio de Aceptación**: Redirige a `/login` si no hay sesión activa; si el rol no coincide con `allowedRoles`, redirige a la ruta principal de su propio rol (`/profesor` o `/alumno`).

---

### Fase 4: Componentes de Login y UI de Autenticación (`src/features/auth/components/`)

- [x] **TASK-007** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-001`, `REQ-AUTH-003`, `REQ-AUTH-004`, `REQ-AUTH-012`
  - **Descripción**: Crear `LoginForm.jsx` con campo unificado "Email o Nombre de Usuario", campo contraseña, estados de carga y mensajes de error estilizados con shadcn/ui.
  - **Criterio de Aceptación**: Permite el ingreso por email o usuario, muestra feedback accesible de error y bloquea envíos múltiples mientras procesa.

- [x] **TASK-008** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-012`
  - **Descripción**: Crear `DevQuickLogin.jsx` (visible en modo DEV) con accesos de 1 clic para "Prof. Leandro Pirro", "Alumno Martín Gómez" y "Alumna Lucía Fernández".
  - **Criterio de Aceptación**: Al hacer clic en cualquiera de los botones, completa las credenciales y ejecuta el login automáticamente.

- [x] **TASK-009** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-009`
  - **Descripción**: Crear `LoginPage.jsx` integrando `LoginForm`, `DevQuickLogin` y la identidad visual de Pirro-System, redirigiendo automáticamente si el usuario ya está autenticado.
  - **Criterio de Aceptación**: Vista visualmente atractiva con paleta Turquesa y Grafito / Titanio Plateado, responsive y con auto-redirección si ya hay sesión.

---

### Fase 5: Layouts Especializados (`ProfesorLayout` & `AlumnoLayout`)

- [x] **TASK-010** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-010`, `REQ-AUTH-013`
  - **Descripción**: Crear `src/app/layouts/ProfesorLayout.jsx` y su barra de navegación `ProfesorSidebar.jsx`, con header de gestión, badge de rol, switch de tema y botón de logout.
  - **Criterio de Aceptación**: Renderiza `<Outlet />`, navegación desktop/tablet y responsive drawer en móviles.

- [x] **TASK-011** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-011`, `REQ-AUTH-013`
  - **Descripción**: Crear `src/app/layouts/AlumnoLayout.jsx` y su barra de navegación táctil `AlumnoBottomNav.jsx` (100% Mobile-First), con botones amplios (`min-h-14`) fijos en la parte inferior.
  - **Criterio de Aceptación**: Elementos táctiles optimizados para el uso con una sola mano en el gimnasio, safe-bottom padding y botón accesible para cerrar sesión.

- [x] **TASK-012** | **Worker**: `frontend` | **Requisito**: `REQ-AUTH-006` a `REQ-AUTH-011`
  - **Descripción**: Crear las vistas iniciales de destino (`ProfesorHome.jsx`, `AlumnoHome.jsx`, `UnauthorizedPage.jsx`) y ensamblar la jerarquía de rutas en `src/app/AppRoutes.jsx` y `src/App.jsx` bajo `BrowserRouter`.
  - **Criterio de Aceptación**: La navegación completa funciona: `/login`, `/profesor/*`, `/alumno/*`, `/unauthorized`, con preservación del Tablero Fundacional accesible para el profesor en modo DEV.

---

### Fase 6: Pruebas Automatizadas y Verificación Final (`src/tests/`)

- [x] **TASK-013** | **Worker**: `qa` | **Requisito**: `REQ-AUTH-014`
  - **Descripción**: Crear la suite de pruebas unitarias y de integración en Vitest:
    - `src/tests/authService.test.js`: Pruebas de contrato y lógica de auth en Mock.
    - `src/tests/ProtectedRoute.test.jsx`: Pruebas de protección de rutas y redirecciones.
    - `src/tests/LoginForm.test.jsx`: Pruebas de formulario de login y accesos rápidos DEV.
    - `src/tests/Layouts.test.jsx`: Pruebas de renderizado de `ProfesorLayout` y `AlumnoLayout`.
  - **Criterio de Aceptación**: El 100% de los tests en modo Mock pasan exitosamente con `npm test`.

- [x] **TASK-014** | **Worker**: `qa` | **Requisito**: `REQ-AUTH-015`
  - **Descripción**: Crear `src/tests/authAdapter.supabase.test.js` con pruebas de integración reales protegidas por `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`.
  - **Criterio de Aceptación**: La suite se omite limpiamente en modo sin Docker y está lista para ejecutarse con `npm run test:supabase`.

- [x] **TASK-015** | **Worker**: `qa` | **Requisito**: `REQ-AUTH-013`, `REQ-AUTH-014`
  - **Descripción**: Ejecutar `npm run build` y la suite completa `npm run test`, comprobando que no existan errores de compilación ni advertencias de lint o tipos.
  - **Criterio de Aceptación**: Build limpio y suite completa pasando en verde.
