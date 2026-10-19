# Especificación de Requisitos: 002 — Autenticación Unificada, Roles y Layouts Protegidos

## 1. Propósito y Alcance
Implementar el sistema integral de autenticación, control de acceso basado en roles (`RBAC`) y navegación protegida para **Pirro-System**:
1. **Autenticación Unificada**: Inicio de sesión admitiendo indistintamente `email` o `nombre_usuario` (con verificación del estado activo en `usuarios` y `personas`).
2. **Proveedor Dual (Mock <-> Supabase Auth)**: Implementación desacoplada con paridad de contrato estricta entre `mockAdapter` (persistencia en `localStorage` bajo `pirro_auth_session`) y `supabaseAdapter` (integración con `supabase.auth` y resolución de identidad).
3. **Gestor de Estado y Contexto (`AuthProvider` / `useAuth`)**: Manejo global reactivo de la sesión, usuario actual, rol y estado de carga.
4. **Guard de Rutas Protegidas (`ProtectedRoute`)**: Redirección automática de usuarios no autenticados hacia `/login`, y redirección inteligente por rol (los alumnos no pueden entrar a `/profesor` ni los profesores a `/alumno`).
5. **Layouts Especializados**:
   - `ProfesorLayout`: Optimizado para escritorio y tableta/móvil con barra de navegación lateral/superior y métricas de gestión.
   - `AlumnoLayout`: 100% Mobile-First para uso táctil con una sola mano en el gimnasio, barra de navegación inferior fija (`bottom-nav`, botones táctiles `>= 44px` / `min-h-11`) y estética deportiva de alto contraste.
6. **Entorno Confirmado (Docker Gate)**:
   - **Modo A — Sin Docker Activo Ahora**: Pruebas de autenticación y layouts en Vitest ejecutadas y aprobadas en modo `Mock`. Migración complementaria de Supabase y tests `*.supabase.test.js` preparados con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`.

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Autenticación Unificada y Proveedor Dual (`REQ-AUTH-001` a `REQ-AUTH-005`)

- **`REQ-AUTH-001` (Ubiquitous — Login Unificado Email o Nombre de Usuario)**:
  El formulario de inicio de sesión **debe** permitir al usuario ingresar sus credenciales mediante un único campo identificador (`email` o `nombre_usuario`), validando que si la entrada contiene un `@` se trate como búsqueda por correo electrónico, y si no contiene `@` se trate como búsqueda por `nombre_usuario`.

- **`REQ-AUTH-002` (Ubiquitous — Paridad de Contrato en Servicios de Autenticación)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar los métodos del módulo de autenticación con idénticas firmas y respuestas:
  1. `login({ identifier, password })`:
     - Retorna `{ ok: true, session: { token, expiresAt }, user: { id, nombre_usuario, email, rol, nombre, apellido, id_persona, id_usuario, perfil_alumno } }` ante credenciales válidas.
     - Retorna `{ ok: false, error: { code: string, message: string } }` ante fallo.
  2. `logout()`:
     - Invalida la sesión actual y limpia la persistencia local, retornando `{ ok: true }`.
  3. `getCurrentSession()`:
     - Retorna `{ user, session }` si hay una sesión activa no expirada, o `null` si no hay sesión.
  4. `onAuthStateChange(callback)`:
     - Registra un observador que recibe eventos de cambio de sesión (`SIGN_IN`, `SIGN_OUT`) y devuelve un objeto de cancelación `{ unsubscribe: () => void }`.

- **`REQ-AUTH-003` (Unwanted Behavior — Bloqueo de Cuentas Inactivas)**:
  **SI** un usuario intenta iniciar sesión y su registro en `usuarios.estado === false` o su registro en `personas.estado === false`, **ENTONCES** el adaptador **debe** rechazar la autenticación retornando el código de error `ACCOUNT_INACTIVE` con el mensaje *"Tu cuenta se encuentra deshabilitada. Comunicate con tu profesor."*

- **`REQ-AUTH-004` (Unwanted Behavior — Rechazo de Credenciales Incorrectas)**:
  **SI** el identificador no existe o la contraseña no es válida, **ENTONCES** el adaptador **debe** rechazar la solicitud retornando el código de error `INVALID_CREDENTIALS` con el mensaje *"Usuario o contraseña incorrectos."*

- **`REQ-AUTH-005` (Ubiquitous — Persistencia y Recuperación de Sesión en Mock)**:
  En modo Mock, la sesión activa **debe** almacenarse en `localStorage` bajo la clave `pirro_auth_session` estructurada con token simulado y timestamp de expiración (24 horas), actualizando además el campo `ultimo_acceso` en la base mock.

---

### B. Gestión de Sesión y Guardias de Rutas (`REQ-AUTH-006` a `REQ-AUTH-009`)

- **`REQ-AUTH-006` (Ubiquitous — Contexto Global de Autenticación `useAuth`)**:
  El sistema **debe** proveer un `AuthProvider` y un custom hook `useAuth()` que exponga `{ user, session, role, isAuthenticated, isLoading, login, logout }`, gestionando el ciclo de vida de la sesión sin parpadeos de redirección durante la carga inicial.

- **`REQ-AUTH-007` (Event-Driven — Redirección de Rutas Protegidas `ProtectedRoute`)**:
  **CUANDO** un usuario no autenticado intente acceder a una ruta protegida (`/profesor/*` o `/alumno/*`), el componente `ProtectedRoute` **debe** redirigirlo a `/login` preservando la ruta solicitada en `location.state.from` para una posterior redirección post-login.

- **`REQ-AUTH-008` (State-Driven — Control de Acceso Basado en Roles `allowedRoles`)**:
  **MIENTRAS** un usuario autenticado intente ingresar a una ruta protegida restringida a un rol que no le corresponde (ej. alumno navegando a `/profesor` o profesor navegando a `/alumno`), el componente `ProtectedRoute` **debe** redirigirlo automáticamente a la vista raíz correspondiente a su rol asignado (`/profesor` o `/alumno`).

- **`REQ-AUTH-009` (Event-Driven — Redirección de Usuarios ya Autenticados en Login)**:
  **CUANDO** un usuario con sesión activa visite la ruta pública `/login`, el sistema **debe** redirigirlo inmediatamente a su portal correspondiente según su rol (`/profesor` o `/alumno`).

---

### C. Layouts Especializados y Mobile-First UI (`REQ-AUTH-010` a `REQ-AUTH-013`)

- **`REQ-AUTH-010` (Ubiquitous — `ProfesorLayout` para Escritorio y Gestión)**:
  El layout del profesor **debe** incluir:
  1. Barra superior con identidad visual deportiva de Pirro-System, nombre completo del profesor ("Prof. Leandro Pirro"), badge distintivo de rol, alternador de tema claro/oscuro y botón de cierre de sesión.
  2. Barra lateral de navegación (Sidebar colapsable en móvil) con enlaces a: Inicio/Dashboard (`/profesor`), Gimnasios (`/profesor/gimnasios`), Ejercicios (`/profesor/ejercicios`), Alumnos (`/profesor/alumnos`), Rutinas (`/profesor/rutinas`), Progreso (`/profesor/progreso`).
  3. Área de contenido principal (`<Outlet />`) responsive.

- **`REQ-AUTH-011` (Ubiquitous — `AlumnoLayout` 100% Mobile-First para Gimnasio)**:
  El layout del alumno **debe** incluir:
  1. Barra superior compacta con saludo personalizado ("Hola, {nombre}"), nombre del gimnasio asignado al alumno, alternador de tema y acceso al perfil / cerrar sesión.
  2. Barra de navegación inferior fija (`BottomNavigation`) con botones táctiles de al menos 44px de altura (`min-h-11`), optimizados para uso con una sola mano en el gimnasio:
     - "Entrenar" (`/alumno` o `/alumno/entrenar`)
     - "Rutinas" (`/alumno/rutinas`)
     - "Historial" (`/alumno/historial`)
     - "Perfil" (`/alumno/perfil`)
  3. Contenedor principal con safe-padding inferior para evitar que el contenido quede oculto detrás de la barra de navegación táctil.

- **`REQ-AUTH-012` (Optional Feature — Acceso Rápido Demo en Desarrollo `DevQuickLogin`)**:
  **DONDE** la aplicación se ejecute en modo desarrollo (`import.meta.env.DEV === true`), el formulario de inicio de sesión **debe** ofrecer botones de 1 clic para iniciar sesión directamente como:
  - "Profesor (Leandro Pirro)"
  - "Alumno (Martín Gómez)"
  - "Alumna (Lucía Fernández)"
  agilizando las pruebas y demostraciones locales.

- **`REQ-AUTH-013` (Ubiquitous — Clean Code y Reglas de Calidad)**:
  Todo el código generado **debe** respetar:
  - Ausencia de punto y coma (`;`).
  - Límite orientativo de ~40 líneas por función/componente y ~100 líneas por archivo.
  - Trazabilidad explícita mediante comentarios `// Anchored to REQ-AUTH-XXX`.

---

### D. Estrategia de Pruebas Dual Sin Docker (`REQ-AUTH-014` a `REQ-AUTH-015`)

- **`REQ-AUTH-014` (Ubiquitous — Suite de Pruebas Mock en Vitest)**:
  El comando `npm run test` **debe** validar automáticamente:
  1. `authService`: login por email, login por username, error por contraseña incorrecta, error por cuenta inactiva, logout y persistencia de sesión.
  2. `ProtectedRoute`: redirección a `/login` si no hay sesión, redirección cruzada de roles (`alumno` en ruta profesor y viceversa) y paso permitido para el rol correcto.
  3. `LoginForm`: renderizado de campos unificados, selector de credenciales rápidas en desarrollo y envío del formulario.
  4. `ProfesorLayout` y `AlumnoLayout`: renderizado de elementos clave y botones de cierre de sesión.

- **`REQ-AUTH-015` (Ubiquitous — Artefactos de Supabase Auth Preparados)**:
  Se **deben** proveer:
  1. Migración SQL en `workspace/supabase/migrations/20261009000001_auth_helpers.sql` con una función `public.resolve_user_email_by_identifier(text)` para permitir el login por nombre de usuario en Supabase Auth.
  2. Suite de pruebas de integración `src/tests/authAdapter.supabase.test.js` marcada con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)`.

---

## 3. Criterios de Aceptación y Matriz de Trazabilidad

| REQ-ID | Descripción Corta | Artefacto Principal | Método de Verificación |
| :--- | :--- | :--- | :--- |
| `REQ-AUTH-001` | Campo unificado de login (email o username) | `src/features/auth/components/LoginForm.jsx` | `LoginForm.test.jsx` |
| `REQ-AUTH-002` | Paridad de contrato en métodos de login/logout | `src/services/adapters/mockAuthAdapter.js`, `supabaseAuthAdapter.js` | `authService.test.js` |
| `REQ-AUTH-003` | Bloqueo estricto de cuentas inactivas | Adaptadores de auth | Unit tests en `authService.test.js` |
| `REQ-AUTH-004` | Manejo controlado de credenciales incorrectas | Adaptadores de auth | Unit tests en `authService.test.js` |
| `REQ-AUTH-005` | Persistencia en `pirro_auth_session` en Mock | `mockAuthAdapter.js` | Unit tests en `authService.test.js` |
| `REQ-AUTH-006` | Contexto `AuthProvider` y hook `useAuth` | `src/features/auth/context/AuthContext.jsx` | Tests de integración React |
| `REQ-AUTH-007` | `ProtectedRoute` redirige a `/login` si no autenticado | `src/app/routes/ProtectedRoute.jsx` | `ProtectedRoute.test.jsx` |
| `REQ-AUTH-008` | `ProtectedRoute` restringe acceso por rol | `src/app/routes/ProtectedRoute.jsx` | `ProtectedRoute.test.jsx` |
| `REQ-AUTH-009` | Redirección de `/login` si ya está autenticado | `src/features/auth/components/LoginPage.jsx` | `LoginPage.test.jsx` |
| `REQ-AUTH-010` | `ProfesorLayout` (Desktop + Responsive) | `src/app/layouts/ProfesorLayout.jsx` | `ProfesorLayout.test.jsx` |
| `REQ-AUTH-011` | `AlumnoLayout` (Mobile-First + BottomNav) | `src/app/layouts/AlumnoLayout.jsx` | `AlumnoLayout.test.jsx` |
| `REQ-AUTH-012` | Botones de acceso rápido en desarrollo | `src/features/auth/components/DevQuickLogin.jsx` | `LoginForm.test.jsx` |
| `REQ-AUTH-013` | Clean Code (~40 líneas/función, ~100 líneas/archivo, sin `;`) | Todos los archivos de `src/` | Linter / build / revisión |
| `REQ-AUTH-014` | Tests Mock pasando al 100% sin Docker | `src/tests/*.test.{js,jsx}` | `npm run test` |
| `REQ-AUTH-015` | Migración SQL y tests de Supabase preparados | `workspace/supabase/migrations/`, `authAdapter.supabase.test.js` | `npm run test` (skip) & revisión SQL |
