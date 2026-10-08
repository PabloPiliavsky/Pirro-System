# HISTORIAL DE CAMBIOS Y DECISIONES TÉCNICAS (`HISTORY.md`)

## [2026-10-08 18:05] Inicialización Constitucional y Reconfiguración de Skills para Pirro-System

### Decisiones de Arquitectura y Gobernanza SDD
- **Constitución Fundacional (`docs/constitution.md`)**: Se estableció la arquitectura de **Pirro-System** (React 19 + Vite 8 + Tailwind CSS v4 + `shadcn/ui` + Supabase PostgreSQL) incorporando la estrategia de **Desarrollo Dual (`Mock sin Docker` <-> `Supabase Real`)**, la separación relacional `usuarios` -> `personas` (con `rol`) -> `perfil_alumno` y el guardado local por serie en `localStorage` con envío único por lote (`Batch Save`).
- **Depuración de Skills Obsoletas**: Se eliminaron de `.agent/skills/` las 3 skills heredadas de facturación AFIP/ARCA (`AFIP_WebServices_Expert_Skill`, `backend-node-express-mysql`, `pos-fiscal-qr-print`).
- **Nuevas Skills Generadas para Pirro-System**:
  - `dual-data-provider-offline-sync`: Patrón de proveedor dual (`mockAdapter` sin Docker vs `supabaseAdapter` con paridad estricta) y custom hook `useRoutineLocalStorage`.
  - `supabase-postgres-rls-rpc`: Esquema relacional en PostgreSQL (`usuarios`, `personas`, `perfil_alumno`, `gimnasios`, `equipamiento`, `ejercicios`, `rutinas`, `registros_rutina`, `detalle_series`), políticas RLS por rol y función transaccional `guardar_entrenamiento_batch`.
  - `gym-excel-export-reporting`: Generación de reportes y planillas en formato `.xlsx` compatible con ambos modos de datos.
- **Alineación Integral de `.agent/`**: Se actualizaron `AGENT.md`, `sdd-constitution.md`, `sdd-skill.md`, `frontend_SOUL.md`, `backend_SOUL.md`, `01_PLANNER.md`, `02_SYNTHESIZER.md` y `MEMORY.md`.
