# Comando: /sdd-constitution
Actúa como **El Guardián de la Constitución del Proyecto**. Tu objetivo es inicializar o actualizar el archivo `docs/constitution.md` definiendo las leyes inquebrantables de **Pirro-System** y sugiriendo la invocación posterior de `/sdd-skill` y `/sdd-roadmap` (usando `01_PLANNER.md`) para desglosar el mapa maestro de la aplicación.

## Instrucciones de Ejecución
1. Revisa la tecnología del proyecto:
   - **Frontend**: React 19, Vite 8, Tailwind CSS v4, `shadcn/ui`, Clean Code (~40 líneas por función, ~100 líneas por archivo, sin `;`).
   - **Backend/DB**: Supabase (PostgreSQL, Auth, RLS, funciones transaccionales RPC) bajo `workspace/supabase/`.
   - **Desarrollo Dual Obligatorio (`Mock` <-> `Supabase`)**: Soporte nativo para trabajar en modo `VITE_DATA_MODE=mock` (para desarrollar y probar en cualquier PC sin Docker) y en modo `VITE_DATA_MODE=supabase` (conectado a Supabase Local CLI o a Supabase Cloud Staging `pirro-dev` / Producción `pirro-prod`), garantizando paridad estricta de contratos en la capa `src/services/`.
2. Si `docs/constitution.md` no existe, créalo con las siguientes secciones:
   - **I. Principios de Arquitectura y Desarrollo Dual (Mock <-> Supabase)**: Modularización por features, SRP, prohibición de importar Supabase directo en componentes UI y paridad de contrato entre proveedores.
   - **II. Reglas Críticas de Dominio y Modelo Relacional**: Relación `usuarios` -> `personas` (con `rol`) -> `perfil_alumno`, equipamiento por gimnasio y guardado offline-first en `localStorage` con envío único por lote (`Batch Transaction`).
   - **III. Estándar de UI/UX**: Mobile-First para el alumno en el gimnasio y panel responsive para el profesor, con `shadcn/ui`.
   - **IV. Estrategia de Pruebas Dual**: Tests en `Vitest` para el modo Mock sin Docker, tests de paridad de contrato y validación de SQL/RLS/RPC en Supabase.
   - **V. Control de Cambios**: Toda modificación requiere una `spec.md` aprobada previa.
3. Si el archivo ya existe, actualiza únicamente las leyes aprobadas por el usuario.
4. **Siguiente Paso Obligatorio**: Al guardar `docs/constitution.md`, sugiere verificar las skills con `/sdd-skill` o armar la hoja de ruta con `/sdd-roadmap`.

## Formato de Salida
Presenta la constitución creada o modificada en `docs/constitution.md` y sugiere proceder con `/sdd-skill` o `/sdd-roadmap`.
