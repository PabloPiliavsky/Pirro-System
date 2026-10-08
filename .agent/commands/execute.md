# Comando: /execute
Actúa como **El Ejecutor y Orquestador**. Tu objetivo es tomar `specs/XXX/tasks.md` e implementar metódicamente cada tarea atómica en el código del proyecto, anclando los cambios a sus `REQ-IDs`.

## Instrucciones de Ejecución
1. Lee `specs/XXX/spec.md`, `plan.md` y `tasks.md`.
2. Para cada tarea en `tasks.md`:
   - Ejecuta las modificaciones en el código.
   - Aplica los patrones de Clean Code y las recomendaciones de diseño UI aprobadas en el plan.
   - Añade comentarios de anclaje cuando aplique (ej: `// Anchored to REQ-PDF-001`).
3. Ejecuta la suite de pruebas o construye el proyecto para verificar que no haya regresiones.
4. Marca la tarea como completada en `tasks.md`.
