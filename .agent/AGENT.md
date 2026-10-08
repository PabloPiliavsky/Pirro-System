# AGENT.md

## Project Overview
Este proyecto es el entorno de desarrollo de **Pirro-System**, una aplicación web responsive (**Mobile-First** para los alumnos en el gimnasio y optimizada en escritorio/celular para el profesor **Leandro Pirro**), construida con **React 19 + Vite 8 + Tailwind CSS v4 + shadcn/ui** y **Supabase (PostgreSQL + Auth + RLS + RPC)**, orquestada mediante un **sistema de agentes especializados de IA** bajo la metodología **Spec-Driven Development (SDD)** y gobernada por `docs/constitution.md`.

## Perfil de Especialización del Sistema de Agentes (Pirro-System)
Todos los agentes del sistema (Orquestador, Worker Frontend, Worker Supabase/Data y Sintetizador QA) dominan las reglas de negocio y arquitectura del proyecto:
1. **Arquitectura de Desarrollo Dual (`Mock Sin Docker` <-> `Supabase Real`)**:
   - Capacidad de operar al 100% en cualquier computadora sin Docker (`VITE_DATA_MODE=mock`) mediante un proveedor local con datos semilla realistas (`pirro_mock_db_v1`), y alternar sin cambios en la UI a **Supabase** (`VITE_DATA_MODE=supabase`, tanto en Supabase CLI Local como en los proyectos gratuitos en la nube `pirro-dev` y `pirro-prod`).
   - Paridad estricta de contratos en la capa `workspace/frontend/src/services/`.
2. **Modelo Relacional Normalizado (`usuarios` -> `personas` -> `perfil_alumno`)**:
   - Separación entre credenciales de acceso (`usuarios`), identidad civil y rol (`personas` con `rol: 'profesor' | 'alumno'`), y datos físicos/deportivos (`perfil_alumno`), vinculados con `gimnasios`, `equipamiento`, `ejercicios`, `rutinas`, `rutina_ejercicios`, `registros_rutina` y `detalle_series`.
3. **Optimización Crítica en el Gimnasio (`localStorage` + Batch Transaction)**:
   - Cero llamadas a base de datos mientras el alumno entrena y completa series en el modal interactivo (`useRoutineLocalStorage`).
   - Envío único por lote con clave de idempotencia (`clientSubmissionId`) al presionar el botón **"Guardar"**.

## Stack Tecnológico (Workspace)
- **Frontend (`workspace/frontend/`)**:
  - **Framework**: React 19 (JavaScript `.js` y `.jsx`).
  - **Build Tool**: Vite 8.
  - **Styling & UI**: Tailwind CSS v4 (`@import "tailwindcss";`) + `shadcn/ui` + `lucide-react`.
  - **Data Layer**: Capa de servicios dual (`mockAdapter` en `localStorage` + `supabaseAdapter` con `@supabase/supabase-js`).
  - **Exportación**: Generación de archivos `.xlsx` (Excel) para rutinas e historial de progreso.
- **Base de Datos y Backend BaaS (`workspace/supabase/`)**:
  - **Motor SQL**: PostgreSQL gestionado en Supabase.
  - **Seguridad**: Row Level Security (RLS) por rol (`'profesor'` vs `'alumno'`).
  - **Transacciones**: Funciones SQL RPC (`guardar_entrenamiento_batch`, alta de alumnos) y semillas de prueba (`seed.sql`).

## Estructura del Directorio
- `docs/constitution.md`: Constitución del proyecto con las leyes arquitectónicas y de dominio no negociables.
- `specs/`: Especificaciones formales EARS (`spec.md`), hoja de ruta (`roadmap.md`), planes (`plan.md`) y desglose de tareas (`tasks.md`).
- `workspace/`:
  - `frontend/`: Aplicación SPA React (bajo la arquitectura de `frontend_SOUL.md`).
  - `supabase/`: Migraciones SQL, funciones RPC, políticas RLS y `seed.sql` (bajo la arquitectura de `backend_SOUL.md`).
  - `reports/`: Reportes finales de síntesis e integración.
- `.agent/`:
  - `commands/`: Comandos del flujo SDD (`/sdd-constitution`, `/sdd-skill`, `/sdd-roadmap`, `/sdd-spec`, `/sdd-plan`, `/sdd-tasks`, `/sdd-implement`, `/refactor`, `/test`, `/sdd-validate`).
  - `plans/`: Planes de ejecución actuales e históricos.
  - `skills/`: Guías de referencia (`supabase`, `supabase-postgres-best-practices`, `supabase-postgres-rls-rpc`, `dual-data-provider-offline-sync`, `gym-excel-export-reporting`, `vite`, `shadcn`, `frontend-design`, `vercel-react-best-practices`).
  - `orchestrator/`: Prompts de agentes de nivel orquestador (`01_PLANNER.md` y `02_SYNTHESIZER.md`).
  - `workers/`: Prompts de los agentes ejecutores (`frontend_SOUL.md` y `backend_SOUL.md`).
  - `MEMORY.md` y `HISTORY.md`: Memoria semántica e historial de decisiones.

## AI Workflow (Flujo de Trabajo Multi-Agente)
1. **Planificación y Docker Gate (`01_PLANNER.md`)**: Evalúa el requerimiento contra `docs/constitution.md`, **pregunta obligatoriamente al usuario si en esta sesión ejecutará las pruebas con Docker/Supabase activo o si prefiere correr los tests en modo Mock dejando las migraciones y tests de Supabase preparados**, y escribe el plan en `specs/` o `.agent/plans/`. **Nunca inicia ejecución sin la aprobación explícita del humano (Human Gate + Docker Gate).**
2. **Ejecución (`workers/`)**: Una vez aprobado el plan, `frontend_SOUL.md` y `backend_SOUL.md` implementan el código asegurando que funcione tanto en modo `mock` (sin Docker) como en modo `supabase` (escribiendo siempre ambos adaptadores y dejando listos los tests de Supabase).
3. **Síntesis (`02_SYNTHESIZER.md`)**: Ejecuta `npm run build` y `npm run test` (y `npm run test:supabase` si Docker está activo, o certifica que los tests `*.supabase.test.js` y migraciones quedaron 100% preparados si se trabaja sin Docker), guardando el informe en `workspace/reports/reporte_sintesis.md`.

## Normas de Comunicación y Formato de Respuesta
Al finalizar cualquier tarea de implementación, responder con:
1. **Estado**: `[EXITOSO / CON ERRORES / REQUIERE REVISIÓN]`
2. **Resumen Ejecutivo**: Explicación concisa del cambio realizado.
3. **Archivos Modificados**: Enlaces clicables markdown (`[archivo](file:///ruta)`) con breve explicación.
4. **Pruebas y Verificaciones Realizadas**: Comandos ejecutados y resultados (en modo Mock y/o Supabase).
5. **Pasos Siguientes**: Próximo comando SDD recomendado.
