# Desglose de Tareas: 003 — ABM de Gimnasios, Equipamiento y Catálogo de Ejercicios

## Estado del Modo de Entorno (`Docker Gate`)
- **Modo Activo**: **Modo B — Con Docker / Supabase Activo Ahora**.
- **Alcance de Ejecución**: Se desarrollan los servicios y componentes en `workspace/frontend/` asegurando paridad estricta entre `mockAdapter.js` y `supabaseAdapter.js`. Todas las pruebas en modo Mock (`npm test`) y las pruebas de integración en vivo contra Supabase Local en Docker (`npm run test:supabase`) deben ejecutarse y pasar al 100%.

---

## Lista Secuencial de Tareas Atómicas

### Fase 1: Validadores y Capa de Adaptadores Dual (`src/services/`)

- [x] **TASK-001** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-003`, `REQ-EJE-004`
  - **Descripción**: Crear `src/services/validators/gimnasiosValidator.js` y `src/services/validators/ejerciciosValidator.js` para validar campos obligatorios y tipos de datos antes del guardado.
  - **Criterio de Aceptación**: Rechaza datos sin nombre, nombres vacíos o ejercicios que requieran equipamiento sin `id_equipamiento_requerido`.

- [x] **TASK-002** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-001`, `REQ-GYM-002`, `REQ-GYM-004`, `REQ-GYM-005`
  - **Descripción**: Extender `src/services/adapters/mockAdapter.js` y `src/services/adapters/supabaseAdapter.js` con las operaciones CRUD completas de gimnasios (`getGimnasios`, `getEquipamientoMaestro`, `guardarGimnasio`, `eliminarGimnasio`).
  - **Criterio de Aceptación**: Ambos adaptadores devuelven y reciben contratos relacionales idénticos con sincronización atómica de `gimnasio_equipamiento`.

- [x] **TASK-003** | **Worker**: `frontend` | **Requisito**: `REQ-EJE-001`, `REQ-EJE-002`, `REQ-EJE-005`
  - **Descripción**: Extender `src/services/adapters/mockAdapter.js` y `src/services/adapters/supabaseAdapter.js` con las operaciones CRUD de ejercicios (`getEjercicios`, `guardarEjercicio`, `eliminarEjercicio`).
  - **Criterio de Aceptación**: Respetan la estructura de `ejercicios` con `id_equipamiento_requerido`, indicaciones y `url_video`.

- [x] **TASK-004** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-007`
  - **Descripción**: Crear las fachadas de servicio `src/services/gimnasiosService.js` y `src/services/ejerciciosService.js` consumiendo el `dataProvider` activo.
  - **Criterio de Aceptación**: Cero acoplamiento a adaptadores concretos en los componentes visuales.

---

### Fase 2: Módulo de Gimnasios y Equipamiento (`src/features/gimnasios/`)

- [x] **TASK-005** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-001`, `REQ-GYM-006`
  - **Descripción**: Crear `src/features/gimnasios/hooks/useGimnasios.js` para gestionar el estado reactivo de las sedes, carga, errores y operaciones de guardado y baja lógica.
  - **Criterio de Aceptación**: Hook limpio $\le 40$ líneas por función que encapsula la interacción con `gimnasiosService`.

- [x] **TASK-006** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-006`
  - **Descripción**: Crear `src/features/gimnasios/components/GimnasioCard.jsx` mostrando dirección, horarios, badge de estado operativo, lista resumida de equipamientos y botones de edición y baja.
  - **Criterio de Aceptación**: Componente estilizado con tokens deportivos de Pirro-System y feedback visual claro.

- [x] **TASK-007** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-002`, `REQ-GYM-005`, `REQ-GYM-006`
  - **Descripción**: Crear `src/features/gimnasios/components/GimnasioFormModal.jsx` para alta y edición de sedes con asignación interactiva de equipamiento mediante checkboxes.
  - **Criterio de Aceptación**: Permite seleccionar máquinas/pesos libres del catálogo maestro y guarda la sede atómicamente.

- [x] **TASK-008** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-006`
  - **Descripción**: Crear `src/features/gimnasios/components/GimnasiosPage.jsx` integrando la grilla de tarjetas, el botón de creación y el modal.
  - **Criterio de Aceptación**: Vista responsiva lista para ser montada en el panel del profesor.

---

### Fase 3: Módulo de Catálogo de Ejercicios (`src/features/ejercicios/`)

- [x] **TASK-009** | **Worker**: `frontend` | **Requisito**: `REQ-EJE-001`, `REQ-EJE-006`
  - **Descripción**: Crear `src/features/ejercicios/hooks/useEjercicios.js` con soporte para filtrado en memoria por texto y por grupo muscular, junto con operaciones CRUD.
  - **Criterio de Aceptación**: Filtra en tiempo real sin latencia ni bloqueos de interfaz.

- [x] **TASK-010** | **Worker**: `frontend` | **Requisito**: `REQ-EJE-006`
  - **Descripción**: Crear `src/features/ejercicios/components/EjercicioCard.jsx` con badge de grupo muscular, indicador de máquina requerida, instrucciones técnicas y botón de enlace a video.
  - **Criterio de Aceptación**: Presentación visual clara de los requerimientos y técnica de cada movimiento.

- [x] **TASK-011** | **Worker**: `frontend` | **Requisito**: `REQ-EJE-002`, `REQ-EJE-003`, `REQ-EJE-006`
  - **Descripción**: Crear `src/features/ejercicios/components/EjercicioFormModal.jsx` con formulario de alta/edición, switch condicional de equipamiento y selector de máquinas maestras.
  - **Criterio de Aceptación**: Valida en cliente y permite asociar el equipamiento requerido cuando el switch está encendido.

- [x] **TASK-012** | **Worker**: `frontend` | **Requisito**: `REQ-EJE-001`, `REQ-EJE-006`
  - **Descripción**: Crear `src/features/ejercicios/components/EjerciciosPage.jsx` integrando barra de búsqueda, chips de grupos musculares, botón "Nuevo Ejercicio", grilla de tarjetas y modal.
  - **Criterio de Aceptación**: Vista completa del catálogo con filtrado instantáneo.

---

### Fase 4: Enrutamiento y Conexión (`src/app/AppRoutes.jsx`)

- [x] **TASK-013** | **Worker**: `frontend` | **Requisito**: `REQ-GYM-006`, `REQ-EJE-006`
  - **Descripción**: Reemplazar los `FeaturePlaceholder` en `src/app/AppRoutes.jsx` para las rutas `/profesor/gimnasios` y `/profesor/ejercicios` conectándolas a `GimnasiosPage` y `EjerciciosPage`.
  - **Criterio de Aceptación**: La navegación en el sidebar del profesor carga directamente las nuevas pantallas funcionales.

---

### Fase 5: Pruebas Automatizadas y Verificación con Docker (`src/tests/`)

- [x] **TASK-014** | **Worker**: `qa` | **Requisito**: `REQ-GYM-009`
  - **Descripción**: Crear suites de pruebas unitarias y de interfaz:
    - `src/tests/gimnasiosService.test.js`: Pruebas CRUD de gimnasios y equipamiento.
    - `src/tests/ejerciciosService.test.js`: Pruebas CRUD y filtrado de catálogo.
    - `src/tests/GimnasiosPage.test.jsx`: Pruebas de renderizado y modal de sedes.
    - `src/tests/EjerciciosPage.test.jsx`: Pruebas de renderizado, búsqueda y modal de ejercicios.
  - **Criterio de Aceptación**: Todas las pruebas en modo Mock pasan con `npm test`.

- [x] **TASK-015** | **Worker**: `qa` | **Requisito**: `REQ-GYM-009`
  - **Descripción**: Crear `src/tests/gimnasiosEjercicios.supabase.test.js` con pruebas de integración en vivo contra Supabase Docker.
  - **Criterio de Aceptación**: Pasa al 100% al ejecutar `npm run test:supabase`.

- [x] **TASK-016** | **Worker**: `qa` | **Requisito**: `REQ-GYM-008`, `REQ-GYM-009`
  - **Descripción**: Ejecutar `npm run build`, `npm test` y `npm run test:supabase`, verificando compilación limpia y paridad total.
  - **Criterio de Aceptación**: Cero errores y verificación visual en navegador.
