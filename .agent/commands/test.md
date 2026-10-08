# Comando: /test
Tu objetivo es generar una suite de pruebas unitarias, de interfaz, de paridad de contrato y de base de datos robusta y completa para el código seleccionado, **anclada explícitamente a los identificadores de requisitos (`REQ-XXX`) de la especificación**.

## Instrucciones de Diseño de Pruebas
1. **Consulta de Entorno (Docker / Supabase Gate)**:
   - Verifica si el usuario indicó que desea **correr las pruebas con Docker / Supabase ahora** o **trabajar sin Docker (ejecutar sólo Mock ahora y dejar los tests de Supabase preparados)**. Si no lo ha indicado en la tarea actual, pregúntale antes de correr la suite.
2. **Doble Nivel de Tests (Siempre se escriben ambos)**:
   - **Tests Ejecutables Sin Docker (`*.test.js` / `*.test.jsx`)**: Prueban componentes React, `useRoutineLocalStorage`, exportación a Excel, `mockAdapter` y paridad estructural de contratos en `Vitest`. Corren siempre con `npm run test` en cualquier computadora.
   - **Tests de Integración / RLS en Supabase (`*.supabase.test.js`)**: Prueban migraciones SQL, políticas RLS (`profesor` vs `alumno`) y la función RPC `guardar_entrenamiento_batch` contra Supabase Local (Docker) o Staging. Se escriben usando `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` para que:
     - Cuando estás **sin Docker**, queden 100% escritos y listos (reportados como `skipped / preparados` sin romper `npm run test`).
     - Cuando estás **con Docker o conectado a Supabase**, se ejecuten en vivo con `npm run test:supabase`.
3. **Verificación de Requisitos (REQ-Anchored)**: Cada test debe referenciar en su descripción el `REQ-ID` correspondiente (ej: `test('REQ-AUTH-001: ...')`).
4. **Happy Path y Casos de Borde (Edge Cases)**:
   - Valida flujos exitosos, entradas inválidas, idempotencia de `clientSubmissionId` y preservación del borrador en `localStorage` si falla la red.

## Formato de Salida
1. Presenta el listado de casos de prueba asociados a sus `REQ-IDs` distinguiendo cuáles corren en modo Mock (sin Docker) y cuáles quedan preparados/ejecutados para Supabase.
2. Tras la confirmación, escribe los archivos de prueba en `workspace/frontend/src/tests/`.