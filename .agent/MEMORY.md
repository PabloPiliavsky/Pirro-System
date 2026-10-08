# MEMORIA SEMÁNTICA Y APRENDIZAJES DEL PROYECTO (`PIRRO-SYSTEM`)

Este archivo contiene el contexto a largo plazo, decisiones de arquitectura y aprendizajes acumulados del proyecto **Pirro-System — Sistema Web Mobile-First de Gestión de Entrenamientos para el profesor Leandro Pirro y sus alumnos**. Debe ser leído por todos los agentes al inicio de cualquier tarea.

## HECHOS VALIDADOS (FACTS)
- **Dominio**: Gestión de gimnasios y su equipamiento, catálogo de ejercicios, alta de alumnos con ficha médica/física, creación de rutinas semanales por día, planilla interactiva mobile-first para el alumno en el gimnasio y exportación de progreso a Excel (`.xlsx`).
- **Stack Tecnológico**:
  - **Frontend (`workspace/frontend/`)**: React 19 (`.js`/`.jsx`), Vite 8, Tailwind CSS v4, `shadcn/ui`, `lucide-react`.
  - **Base de Datos y BaaS (`workspace/supabase/`)**: Supabase (PostgreSQL estándar, Supabase Auth, políticas Row Level Security `RLS` y funciones transaccionales `RPC`).
  - **Desarrollo Dual (`Mock` <-> `Supabase`)**: El usuario requiere poder trabajar y probar el frontend en cualquier computadora **sin Docker** usando `VITE_DATA_MODE=mock` (persistido en `localStorage` con datos semilla reseteables) y también poder conectarlo y validarlo contra **Supabase** (`VITE_DATA_MODE=supabase`, tanto en Supabase CLI Local como en el proyecto gratuito en la nube `pirro-dev` / `pirro-prod`).

## DECISIONES ARQUITECTÓNICAS
- **[2026-10-08] Constitución del Proyecto (`docs/constitution.md`)**:
  1. **Modelo Relacional `usuarios` -> `personas` -> `perfil_alumno`**: La tabla `usuarios` guarda exclusivamente credenciales (`nombre_usuario`, `email`, `password_hash`, `auth_user_id`), mientras que `personas` guarda la identidad civil y define el `rol` (`'profesor'` | `'alumno'`). Los datos físicos, médicos y gimnasio asignado del alumno residen en `perfil_alumno` (relación 1:1 con `personas`).
  2. **Guardado Offline-First en el Gimnasio (`useRoutineLocalStorage` + Batch RPC)**: Mientras el alumno entrena, cada serie cargada en el modal se guarda únicamente en `localStorage` (0 llamadas de red). Al presionar el botón **"Guardar"**, se envía un único payload JSON con `clientSubmissionId` (idempotente) a la función transaccional `guardar_entrenamiento_batch`.
  3. **Patrón de Proveedor Dual con Paridad de Contrato**: Ningún componente React importa `@supabase/supabase-js` directamente. Todo pasa por `src/services/`, donde `mockAdapter` y `supabaseAdapter` implementan exactamente los mismos métodos y nombres de columnas SQL.
  4. **Prevención de Pausa en Supabase Free Tier**: Se contempla un ping automatizado cada 72 horas (GitHub Actions / Cron) para evitar la pausa tras 7 días de inactividad del plan gratuito.
  5. **Pregunta Obligatoria Pre-Desarrollo (`Docker / Supabase Gate`)**: Antes de iniciar el desarrollo o pruebas de cada módulo (`/feature`, `/sdd-implement`, `/test`, `/sdd-validate`), el agente debe preguntar al usuario si desea ejecutar las pruebas con Docker/Supabase en el momento o trabajar sin Docker (corriendo los tests en modo Mock y dejando las migraciones SQL y tests `*.supabase.test.js` preparados con `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` para ejecutarlos cuando se conecte).
  6. **Skills Oficiales de Supabase Instaladas (`npx skills`)**: Se instalaron en `.agent/skills/` las skills oficiales `supabase/agent-skills@supabase-postgres-best-practices` (435.8K installs) y `supabase/agent-skills@supabase` (314.7K installs), complementando las skills propias del dominio (`supabase-postgres-rls-rpc`, `dual-data-provider-offline-sync`, `gym-excel-export-reporting`).

## APRENDIZAJES TÉCNICOS REUTILIZABLES
- **[Frontend / Tailwind v4]**: Al inicializar Vite con Tailwind CSS v4, instalar `tailwindcss` y `@tailwindcss/vite`, configurar el plugin en `vite.config.js` y colocar `@import "tailwindcss";` en `index.css`.
- **[shadcn/ui / Vite JavaScript]**: En proyectos React Vite con JavaScript (`.js`/`.jsx`), configurar `jsconfig.json` con `baseUrl` y `paths: { "@/*": ["./src/*"] }` antes de usar componentes de `shadcn`.
