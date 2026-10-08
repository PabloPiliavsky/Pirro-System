# Hoja de Ruta del Proyecto (Master Feature Roadmap) — Pirro-System

## Constitución de Referencia: [`docs/constitution.md`](file:///c:/Users/Pablo/Desktop/propulsa/Pirro-System/docs/constitution.md)

> **Regla Transversal de Ejecución (`Docker / Supabase Gate`)**:
> Al iniciar cualquiera de las features de esta hoja de ruta, el sistema consultará obligatoriamente si en ese momento se desea **ejecutar las pruebas contra Docker / Supabase en vivo** o si se trabajará **sin Docker (ejecutando los tests en modo `Mock` de inmediato y dejando las migraciones SQL y los tests `*.supabase.test.js` 100% escritos y preparados para ejecutarse cuando haya conexión con Docker/Supabase)**.

---

### Secuencia de Features Planificadas

1. **`specs/001-fundacion-dual-y-esquema/`**: Inicialización del Proyecto React, Esquema SQL Base y Proveedor Dual (`Mock` $\leftrightarrow$ `Supabase`)
   - **Propósito**:
     - Configurar `workspace/frontend/` (React 19 + Vite 8 + Tailwind CSS v4 + `shadcn/ui` + `Vitest`).
     - Definir en `workspace/supabase/migrations/` el esquema relacional completo (`usuarios` $\rightarrow$ `personas` con `rol` $\rightarrow$ `perfil_alumno`, `gimnasios`, `equipamiento`, `gimnasio_equipamiento`, `ejercicios`, `rutinas`, `rutina_ejercicios`, `registros_rutina`, `detalle_series`), las políticas **RLS** y la función RPC `guardar_entrenamiento_batch`, junto con `seed.sql`.
     - Implementar la capa `src/services/dataProvider.js` (`mockAdapter` con datos semilla en `localStorage` + `supabaseAdapter`) y la barra flotante de desarrollo (`DEV`) para alternar entre `MOCK` y `SUPABASE` o resetear semillas sin usar Docker.
   - **Dependencias**: Ninguna (Módulo Fundacional).

2. **`specs/002-autenticacion-y-roles/`**: Autenticación, Gestión de Sesión y Layouts Protegidos (`Profesor` vs `Alumno`)
   - **Propósito**:
     - Login unificado (por email o `nombre_usuario` / DNI) verificando `usuarios` + `personas.rol` y `estado`.
     - Guard de rutas protegidas (`ProtectedRoute`): redirección automática al Panel de Profesor (`ProfesorLayout` escritorio/móvil) o a la App del Alumno (`AlumnoLayout` 100% Mobile-First).
     - Perfil básico y cierre de sesión seguro.
   - **Dependencias**: `001-fundacion-dual-y-esquema`.

3. **`specs/003-gimnasios-y-ejercicios/`**: ABM de Gimnasios, Equipamiento y Catálogo de Ejercicios (Rol Profesor)
   - **Propósito**:
     - Creación, edición y baja lógica de `gimnasios` (nombre, dirección, horario, estado) y asignación de su `equipamiento` disponible (máquinas, pesos libres, accesorios con observaciones).
     - ABM del catálogo de `ejercicios` propios del profesor (nombre, grupo/s muscular/es, indicador de si requiere máquina/equipamiento específico, indicaciones y link de video opcional).
   - **Dependencias**: `002-autenticacion-y-roles`.

4. **`specs/004-gestion-alumnos/`**: ABM de Alumnos y Ficha Física/Médica (Rol Profesor)
   - **Propósito**:
     - Alta y edición de alumnos creando de forma encadenada su cuenta en `usuarios`, su identidad en `personas` (`rol = 'alumno'`) y su ficha en `perfil_alumno` (`id_gimnasio`, `altura_cm`, `peso_kg`, `salud_enfermedades`, `fecha_ingreso`, `fecha_nacimiento`, `cantidad_dias_rutina`, `comentario`), sin cerrar la sesión activa del profesor.
     - Baja lógica (`estado = false`) conservando todo el historial de rutinas y entrenamientos.
   - **Dependencias**: `003-gimnasios-y-ejercicios`.

5. **`specs/005-constructor-rutinas/`**: Armador de Rutinas Semanales por Alumno y Día (Rol Profesor)
   - **Propósito**:
     - Creación y edición de las rutinas semanales propias de cada alumno según su `cantidad_dias_rutina` (ej. Día 1, Día 2, Día 3) asignándoles un nombre personalizado.
     - Selección ordenada de ejercicios del catálogo configurando `series_objetivo`, `repeticiones_objetivo` y `notas_profesor`.
     - Asistente inteligente de equipamiento: advertencia visual si el profesor selecciona un ejercicio que requiere una máquina que no figura en el gimnasio al que asiste ese alumno.
   - **Dependencias**: `004-gestion-alumnos`.

6. **`specs/006-planilla-entrenamiento-alumno/`**: Planilla Interactiva Mobile-First, Modal por Serie y Guardado Local Batch (Rol Alumno)
   - **Propósito**:
     - Vista del alumno con sus rutinas asignadas por día de la semana y selector de `fecha_realizacion`.
     - Grilla interactiva donde cada ejercicio muestra tantas **columnas como series (`series_objetivo`)** debe cumplir.
     - **Modal interactivo por serie**: al tocar una celda de serie, el alumno visualiza las repeticiones objetivo e ingresa `repeticiones_realizadas`, `peso_utilizado` y `comentario_alumno` opcional.
     - **Sincronización Offline-First (`useRoutineLocalStorage`)**: cada serie se guarda instantáneamente en `localStorage` (0 llamadas a la base de datos durante el entrenamiento). Al presionar el botón **"Guardar"** de la planilla, se envía toda la sesión en una única transacción en lote (`guardar_entrenamiento_batch`).
   - **Dependencias**: `005-constructor-rutinas`.

7. **`specs/007-progreso-y-exportacion-excel/`**: Historial de Cargas del Alumno, Seguimiento y Exportación a Excel `.xlsx` (Rol Profesor)
   - **Propósito**:
     - Consulta histórica para el profesor de las planillas completadas por cada alumno (filtradas por fecha, rutina o ejercicio) viendo la evolución de pesos, repeticiones y comentarios.
     - Exportación directa a `.xlsx` (Excel) con hojas estructuradas: `Ficha del Alumno`, `Rutinas Semanales` e `Historial de Entrenamientos`.
   - **Dependencias**: `006-planilla-entrenamiento-alumno`.
