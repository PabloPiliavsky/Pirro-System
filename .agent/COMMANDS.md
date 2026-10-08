# Atajos y Comandos de Desarrollo (Antigravity SDD Commands)

Este directorio contiene los comandos y prompts estructurados diseñados para guiar el flujo de desarrollo guiado por especificaciones (**SDD Spec-Anchored**) y automatizar refactorizaciones, revisiones, pruebas y documentación.

## 🚀 Flujo Principal SDD (Spec-Driven Development)

- **[feature.md](commands/feature.md)** (`/feature`): Orquestador principal para iniciar el ciclo SDD completo de una nueva característica.
- **[guide.md](commands/guide.md)** (`/guide` o `/sdd-guide`): **Asesor y Enrutador del Sistema**. Analiza cualquier mensaje libre del usuario y lo guía hacia el comando y prompt correcto.
- **[sdd-constitution.md](commands/sdd-constitution.md)** (`/sdd-constitution`): Inicializa o edita `docs/constitution.md` con las leyes no negociables del proyecto y deriva a `/sdd-roadmap`.
- **[sdd-roadmap.md](commands/sdd-roadmap.md)** (`/sdd-roadmap` o `/roadmap`): **Planificador Maestro de Hoja de Ruta** (vía `01_PLANNER.md`). Desglosa la app completa tras la constitución en `specs/roadmap.md`.
- **[sdd-skill.md](commands/sdd-skill.md)** (`/sdd-skill` o `/skill`): **Cazador y Creador de Skills**. Audita desde `docs/constitution.md`, elimina skills innecesarias y genera (`skill-generator`) o busca (`find-skill`) las faltantes.
- **[sdd-spec.md](commands/sdd-spec.md)** (`/sdd-spec` o `/spec`): Redacta la especificación formal `specs/XXX/spec.md` en sintaxis **EARS** con identificadores únicos `REQ-XXX`.
- **[sdd-clarify.md](commands/sdd-clarify.md)** (`/sdd-clarify` o `/clarify`): Audita la especificación en búsqueda de ambigüedades y realiza preguntas aclaratorias al usuario.
- **[sdd-plan.md](commands/sdd-plan.md)** (`/sdd-plan` o `/plan`): Traduce la especificación en `plan.md`, **incluyendo una crítica/propuesta de diseño UI/UX basada en las skills de frontend y shadcn**.
- **[sdd-tasks.md](commands/sdd-tasks.md)** (`/sdd-tasks`): Desglosa la planificación en tareas atómicas y ejecutables con criterios de aceptación (`tasks.md`).
- **[sdd-implement.md](commands/sdd-implement.md)** (`/sdd-implement` o `/execute`): Invoca a los **Workers** para implementar el código anclado a los `REQ-IDs` y deriva a `/refactor` y `/test`.
- **[refactor.md](commands/refactor.md)** (`/refactor`): Invoca a **El Optimizador** para aplicar Clean Code (~40 líneas por función) **antes de la fase de pruebas y validación**.
- **[test.md](commands/test.md)** (`/test`): Genera suites completas de pruebas **ancladas a los REQ-IDs obligatoriamente antes de validar**.
- **[sdd-validate.md](commands/sdd-validate.md)** (`/sdd-validate`): Invoca al **Sintetizador (QA Auditor)** para certificar `npm run build` y `npm run test` contra las pruebas generadas.
- **[sdd-status.md](commands/sdd-status.md)** (`/sdd-status`): Muestra el tablero visual del avance de las especificaciones y tareas activas.
- **[sdd-change.md](commands/sdd-change.md)** (`/sdd-change`): Gestiona modificaciones o cambios en requisitos sobre una especificación existente.

---

## 🛠️ Comandos de Calidad, Refactor y Diagnóstico

- **[review.md](commands/review.md)** (`/review`): Invoca a **El Crítico** para auditar seguridad y manejo de errores.
- **[docs.md](commands/docs.md)** (`/docs`): Genera documentación técnica directa para APIs y componentes, actualizando `DOCUMENTATION.md`.
- **[debug.md](commands/debug.md)** (`/debug`): Inicia un diagnóstico estructurado "Chain of Thought" para encontrar la causa raíz y solución de un bug.

---

## Modo de Uso
Escribe en el chat cualquiera de los comandos anteriores (ej: `/feature`, `/sdd-roadmap`, `/sdd-skill`, `/refactor`, `/sdd-status`). El agente adoptará el rol indicado respetando estrictamente la matriz de permisos multi-agente de `.agent/AGENT.md`.
