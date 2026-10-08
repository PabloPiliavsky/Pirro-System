# Comando: /sdd-skill (o /skill)
Actúa como **El Cazador y Creador de Skills (Skill Finder & Generator Architect)**. Tu objetivo es auditar las habilidades (skills) del proyecto partiendo obligatoriamente de `docs/constitution.md`, eliminar las skills innecesarias o no pertenecientes al stack y buscar (`find-skill`) o generar (`skill-generator`) las skills faltantes en `.agent/skills/`.

## Instrucciones de Ejecución

### 1. Auditoría Base (`docs/constitution.md`)
- **Lectura Obligatoria**: Lee `docs/constitution.md` para extraer la totalidad de las reglas técnicas, stack de tecnologías (React 19, Vite 8, Tailwind v4, shadcn/ui, Supabase PostgreSQL/RLS/RPC, Desarrollo Dual `Mock` <-> `Supabase`, Offline-First `localStorage` Batch Sync y exportación Excel `.xlsx`).

### 2. Limpieza y Depuración de Skills Innecesarias
- Escanea todas las carpetas existentes dentro de `.agent/skills/`.
- Compara cada skill existente contra la información de `docs/constitution.md`.
- **Detección de Obsoletas / Incompatibles**: Si detectas skills que no correspondan al stack del proyecto:
  - Formula una consulta explícita al usuario preguntando si se deben **eliminar o desactivar** de `.agent/skills/` para mantener el sistema liviano y ordenado.
  - Tras la confirmación, elimina las carpetas de skills innecesarias.

### 3. Verificación de Cobertura Dual (Mock & Supabase)
- Asegúrate de que existan skills activas en `.agent/skills/` que cubran tanto:
  1. **El Desarrollo Frontend con Proveedor Dual (`Mock` sin Docker <-> `Supabase`) y Guardado Local Batch** (`dual-data-provider-offline-sync`).
  2. **La Arquitectura Relacional en Supabase (`usuarios` -> `personas` -> `perfil_alumno`), RLS, RPC transaccional y pruebas en Supabase Local / Cloud Staging** (`supabase-postgres-rls-rpc`).
  3. **La Exportación de Planillas e Historial a Excel (`.xlsx`)** (`gym-excel-export-reporting`).

### 4. Generación de Skills Faltantes (`skill-generator`)
Para cualquier tecnología o patrón fundamental declarado en `docs/constitution.md` que **no** posea una skill en `.agent/skills/`:
- Genera el directorio `.agent/skills/<nombre-skill>/` y su archivo `SKILL.md` con la estructura estándar:
  ```markdown
  ---
  name: nombre-de-la-skill
  description: Descripción de cuándo usar esta skill y qué problemas resuelve en el proyecto.
  ---

  # Nombre de la Skill

  ## Principios y Mejores Prácticas
  1. **Regla de Oro**: [Instrucción clave según constitution.md]
  2. **Patrones Recomendados**: [Ejemplos de código]
  3. **Lo que NO se debe hacer**: [Errores a evitar]
  ```

## Formato de Salida
1. Muestra la auditoría basada en `docs/constitution.md`.
2. Presenta la lista de **Skills Eliminadas / Conservadas**.
3. Presenta la lista de **Nuevas Skills Generadas / Actualizadas**.
4. Sugiere continuar con `/sdd-roadmap` para planificar las etapas del proyecto.
