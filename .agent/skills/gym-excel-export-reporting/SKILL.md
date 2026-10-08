---
name: gym-excel-export-reporting
description: Generación y exportación de archivos Excel (.xlsx) para el profesor en Pirro-System. Usar al implementar la descarga de rutinas semanales de un alumno, el historial de cargas/series realizadas o el resumen general de alumnos y progreso.
---

# Exportación a Excel (.xlsx) y Reportes de Progreso

## 1. Regla de Oro (Constitución I.1 y III.1)
1. El profesor debe poder exportar en formato `.xlsx` tanto las **rutinas activas** de un alumno como el **historial de planillas completadas** (fechas, ejercicios, series objetivo vs realizadas, pesos utilizados y comentarios).
2. La generación del archivo `.xlsx` se realiza en el cliente partiendo de los datos entregados por la capa `src/services/`, por lo que **funciona de forma idéntica tanto en modo `mock` como en modo `supabase`**.

---

## 2. Patrones Recomendados

### A. Estructura de Hojas en el Archivo `.xlsx` del Alumno
Al exportar el reporte de un alumno (ej. `Pirro_Alumno_Juan_Perez_2026-10-08.xlsx`), organizar el libro en hojas claras:
1. **Hoja 1 — `Ficha del Alumno`**:
   - Nombre y Apellido, Edad, Altura, Peso, Gimnasio al que asiste, Días por semana, Salud/Enfermedades y Comentarios del profesor.
2. **Hoja 2 — `Rutinas Semanales`**:
   - Agrupadas por Día (`Día 1 - ...`, `Día 2 - ...`), listando Orden, Ejercicio, Músculos, Máquina/Elemento, Series Objetivo, Repeticiones Objetivo y Notas.
3. **Hoja 3 — `Historial de Entrenamientos`**:
   - Tabla cronológica con columnas: `Fecha Realización`, `Rutina`, `Ejercicio`, `N° Serie`, `Reps Objetivo`, `Reps Realizadas`, `Peso (kg)` y `Comentario Alumno`.

### B. Desacoplamiento y Modularidad
- Mantener la lógica de construcción de hojas `.xlsx` aislada en `src/features/progreso-excel/utils/excelBuilder.js` (funciones puras de menos de 40 líneas fácilmente testeables en `Vitest`).

---

## 3. Lo que NO se debe hacer
- **PROHIBIDO** acoplar la generación del Excel a consultas directas de base de datos dentro del componente visual.
- **PROHIBIDO** exportar JSON crudo o IDs internos (`id_persona`, `client_submission_id`) en las columnas visibles para el profesor.
