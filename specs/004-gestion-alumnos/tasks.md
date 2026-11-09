# Desglose de Tareas: 004 — ABM de Alumnos y Ficha Física/Médica

## Estado del Modo de Entorno (`Docker Gate`)
- **Modo Activo**: **Modo B — Con Docker / Supabase Activo Ahora**.
- **Alcance de Ejecución**: Se desarrollan los servicios y componentes en `workspace/frontend/` y la migración SQL RPC en `workspace/supabase/migrations/`. Se asegura paridad estricta entre `mockAdapter.js` y `supabaseAdapter.js`. Todas las pruebas unitarias en modo Mock y las pruebas de integración en vivo contra Supabase Local en Docker deben ejecutarse y pasar al 100%.

---

## Lista Secuencial de Tareas Atómicas

### Fase 1: Migración SQL RPC y Capa de Datos Dual (`workspace/`)

- [x] **TASK-001** | **Worker**: `backend` | **Requisito**: `REQ-ALU-002`, `REQ-ALU-011`
  - **Descripción**: Crear la migración `workspace/supabase/migrations/20261010000001_alta_alumno_rpc.sql` con la función transaccional `public.alta_alumno_profesor(payload jsonb)` que valida rol, comprueba unicidad de email/usuario e inserta en `usuarios`, `personas` y `perfil_alumno`.
  - **Criterio de Aceptación**: Inserción atómica y segura sin requerir recrear sesión de auth ni cambiar el token del profesor.

- [x] **TASK-002** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-004`, `REQ-ALU-005`
  - **Descripción**: Crear `workspace/frontend/src/services/validators/alumnosValidator.js` para validar campos obligatorios (`nombre`, `apellido`, `nombre_usuario`, `email`), formato de email, rango de `cantidad_dias_rutina` (1-7) y rangos lógicos para altura y peso.
  - **Criterio de Aceptación**: Lanza excepciones controladas con código `INVALID_ALUMNO_DATA` si los datos no cumplen las restricciones.

- [x] **TASK-003** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-001`, `REQ-ALU-002`, `REQ-ALU-003`, `REQ-ALU-006`, `REQ-ALU-010`
  - **Descripción**: Extender `workspace/frontend/src/services/adapters/mockAdapter.js` con las operaciones CRUD completas de alumnos (`getAlumnos`, `getAlumnoById`, `crearAlumno`, `actualizarAlumno`, `cambiarEstadoAlumno`, `getMiPerfilAlumno`), sincronizando las tablas relacionales simuladas en `localStorage`.
  - **Criterio de Aceptación**: Manejo de transacciones en localStorage, control de duplicados de email/usuario y conservación de integridad referencial.

- [x] **TASK-004** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-001`, `REQ-ALU-002`, `REQ-ALU-003`, `REQ-ALU-006`, `REQ-ALU-010`, `REQ-ALU-011`
  - **Descripción**: Extender `workspace/frontend/src/services/adapters/supabaseAdapter.js` con los mismos métodos invocando la función RPC `alta_alumno_profesor` para creación, y consultas PostgREST con políticas RLS para lectura, edición y alternancia de estado.
  - **Criterio de Aceptación**: Retorna exactamente las mismas estructuras y firmas que `mockAdapter.js`.

- [x] **TASK-005** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-010`
  - **Descripción**: Crear el servicio unificado `workspace/frontend/src/services/alumnosService.js` consumiendo el `dataProvider` activo.
  - **Criterio de Aceptación**: Cero dependencias directas a localStorage o Supabase en los componentes UI.

---

### Fase 2: Utilidades y Hooks de Gestión (`src/features/alumnos/`)

- [x] **TASK-006** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-007`, `REQ-ALU-008`
  - **Descripción**: Crear `src/features/alumnos/utils/alumnoFormatters.js` con funciones puras para calcular edad a partir de `fecha_nacimiento`, calcular y categorizar IMC ($kg/m^2$), y formatear números de teléfono para enlaces `https://wa.me/...`.
  - **Criterio de Aceptación**: Funciones puras con tests unitarios y manejo defensivo de valores nulos o indefinidos.

- [x] **TASK-007** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-001`, `REQ-ALU-006`, `REQ-ALU-007`
  - **Descripción**: Crear el hook reactivo `src/features/alumnos/hooks/useAlumnos.js` para administrar el listado de alumnos, filtros locales en memoria (búsqueda por texto, sede y estado), estado de carga y acciones CRUD.
  - **Criterio de Aceptación**: Funciones $\le 40$ líneas con estado reactivo limpio.

- [x] **TASK-008** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-009`
  - **Descripción**: Crear el hook `src/features/alumnos/hooks/useAlumnoPerfil.js` para consultar la ficha personal del alumno actualmente autenticado y los datos de contacto de su profesor.
  - **Criterio de Aceptación**: Carga asíncrona segura con feedback de loading y error.

---

### Fase 3: Componentes Visuales del Profesor (`src/features/alumnos/components/`)

- [x] **TASK-009** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-007`, `REQ-ALU-008`
  - **Descripción**: Crear `src/features/alumnos/components/AlumnoCard.jsx` representando la tarjeta 'Ficha de Atleta' con iniciales/avatar, nombre, usuario, badge de sede, badge de días de rutina, indicador de advertencia médica, botón a WhatsApp, botón 'Ver Ficha' y menú de acciones.
  - **Criterio de Aceptación**: Diseño deportivo pulido según los tokens de Pirro-System con accesibilidad para teclado.

- [x] **TASK-010** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-008`
  - **Descripción**: Crear `src/features/alumnos/components/FichaMedicaModal.jsx` para exhibir en un modal estructurado la alerta médica de patologías (`salud_enfermedades`), las métricas antropométricas con IMC y las notas del profesor.
  - **Criterio de Aceptación**: Destacado en ámbar/rojo ante patologías y verde ante ausencia de antecedentes.

- [x] **TASK-011** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-002`, `REQ-ALU-003`, `REQ-ALU-004`, `REQ-ALU-005`
  - **Descripción**: Crear `src/features/alumnos/components/AlumnoFormModal.jsx` para alta y edición de alumno, con soporte de contraseña inicial predeterminada (`Pirro123!`), selector de sede opcional, validación en vivo y feedback de error.
  - **Criterio de Aceptación**: Maneja tanto creación como edición sin cerrar sesión ni perder foco.

- [x] **TASK-012** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-007`
  - **Descripción**: Crear `src/features/alumnos/components/AlumnosFilterBar.jsx` con buscador en tiempo real, selector de sede y pestañas de estado (Activos / Inactivos / Todos).
  - **Criterio de Aceptación**: Filtra la lista en memoria de manera instantánea y accesible.

- [x] **TASK-013** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-007`
  - **Descripción**: Crear `src/features/alumnos/components/AlumnosPage.jsx` integrando la barra de filtros, el botón de alta, la grilla responsiva de tarjetas y los modales de formulario y ficha médica.
  - **Criterio de Aceptación**: Vista completa del panel del profesor montada y operativa.

---

### Fase 4: Componente de Ficha Personal del Alumno (`/alumno/perfil`)

- [x] **TASK-014** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-009`
  - **Descripción**: Crear `src/features/alumnos/components/AlumnoPerfilPage.jsx` con interfaz Mobile-First mostrando datos personales, biometría, ficha médica, sede habitual con horarios y datos de contacto de su profesor.
  - **Criterio de Aceptación**: Navegación táctil optimizada ($\ge 44\text{px}$) y diseño responsivo.

- [x] **TASK-015** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-007`, `REQ-ALU-009`
  - **Descripción**: Actualizar `src/app/AppRoutes.jsx` reemplazando los placeholders de `alumnos` en el layout del profesor y de `perfil` en el layout del alumno por `AlumnosPage` y `AlumnoPerfilPage`.
  - **Criterio de Aceptación**: Navegación fluida y protegida por roles.

---

### Fase 5: Pruebas Automatizadas Duales (`tests/`)

- [x] **TASK-016** | **Worker**: `frontend` | **Requisito**: `REQ-ALU-012`
  - **Descripción**: Crear la suite de pruebas unitarias `tests/alumnosService.test.js` testeando el validador, formatters, y las operaciones de creación, edición, alternancia de estado y filtros en modo Mock.
  - **Criterio de Aceptación**: Cobertura del 100% en casos de éxito y de error defensivo.

- [x] **TASK-017** | **Worker**: `backend` | **Requisito**: `REQ-ALU-011`, `REQ-ALU-012`
  - **Descripción**: Crear la suite de pruebas de integración `tests/alumnosService.supabase.test.js` testeando la función RPC `alta_alumno_profesor` y las políticas RLS directamente contra Supabase.
  - **Criterio de Aceptación**: Valida inserción atómica en vivo y paridad con el proveedor Mock.
