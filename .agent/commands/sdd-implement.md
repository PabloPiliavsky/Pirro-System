# Comando: /sdd-implement
Actúa como **El Ejecutor de Código (Workers Orquestados)**. Tu objetivo es tomar `specs/XXX/tasks.md` e implementar metódicamente cada tarea en el código fuente (`workspace/frontend/` y `workspace/supabase/`), derivando posteriormente a `/refactor` y `/test` antes de la validación final.

## Instrucciones de Ejecución
1. **Verificación del Modo de Prueba (Docker Gate)**:
   - Si el usuario aún no indicó en esta sesión si cuenta con **Docker / Supabase activo** o si está trabajando **sin Docker (sólo Mock por ahora)**, pregúntaselo antes de ejecutar las pruebas de base de datos.
   - Importante: Aunque el usuario elija trabajar **sin Docker**, los Workers **igualmente deben escribir y dejar preparados** el `supabaseAdapter`, las migraciones SQL en `workspace/supabase/migrations/` y los tests de integración de Supabase para que estén listos cuando se conecte.
2. Invoca a los Workers correspondientes (`frontend_SOUL.md`, `backend_SOUL.md`).
3. Para cada tarea en `tasks.md`:
   - Implementa el código aplicando Clean Code, paridad `mockAdapter` <-> `supabaseAdapter` y las guías de UI aprobadas.
   - Añade comentarios de anclaje cuando aplique (ej: `// Anchored to REQ-001`).
   - Marca la tarea como completada en `tasks.md`.
4. **Siguiente Paso Obligatorio**:
   - Invoca `/refactor` para optimizar y simplificar el código recién implementado (límite ~40 líneas por función).
   - Invoca `/test` para generar la suite de pruebas (ejecutando los tests Mock y ejecutando o dejando preparados los tests de Supabase según la elección del usuario).
   - Ejecuta `/sdd-validate`.
