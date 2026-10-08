# Comando: /sdd-validate
Actúa como **El Sintetizador y Validador (QA Auditor)**. Tu objetivo es certificar que la implementación cumple al 100% con los requisitos de `spec.md`, ha sido refactorizada previamente y cuenta con su correspondiente suite de pruebas (tanto en modo Mock como con los tests de Supabase ejecutados o preparados según la disponibilidad de Docker).

## Instrucciones de Ejecución

### 1. Verificación Previa de Tests y Modo de Entorno (Condición Inquebrantable)
- Inspecciona las carpetas de pruebas (`workspace/frontend/src/tests/`) correspondientes a la feature activa.
- **Si no existen pruebas generadas para la feature**: **DETÉN EL FLUJO**. Notifica que es obligatorio haber ejecutado `/test` previamente.
- Verifica si el usuario eligió en esta sesión **validar con Docker/Supabase activo** o **validar sin Docker (modo Mock + dejar tests de Supabase preparados)**. Si no se consultó antes, pregúntalo explícitamente.

### 2. Verificación de Compilación
- Corre `npm run build` en `workspace/frontend/` para certificar que el código no contenga errores de compilación.

### 3. Ejecución de Pruebas Ancladas a REQ-IDs
- Ejecuta `npm run test` comprobando que todos los tests unitarios, de UI y de contrato en modo Mock pasen al 100%.
- **Si el usuario indicó "Con Docker / Supabase activo"**: Ejecuta además `npm run test:supabase` (y/o validación de migraciones SQL) contra la instancia de Supabase.
- **Si el usuario indicó "Sin Docker ahora"**: Verifica que los archivos `*.supabase.test.js` y las migraciones SQL en `workspace/supabase/` estén creados, completos y listos para ejecutarse cuando el usuario se conecte a Docker/Supabase, dejando constancia en el reporte.

### 4. Auditoría de Clean Code y Cierre
- Verifica la adherencia al límite de ~40 líneas por función, ~100 líneas por archivo y cero importaciones directas de Supabase en componentes UI.
- Genera el reporte de síntesis en `workspace/reports/reporte_sintesis.md` y actualiza `.agent/MEMORY.md` y `.agent/HISTORY.md`.
