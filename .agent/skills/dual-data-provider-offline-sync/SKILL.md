---
name: dual-data-provider-offline-sync
description: Arquitectura de Proveedor de Datos Dual (VITE_DATA_MODE=mock sin Docker vs VITE_DATA_MODE=supabase) con paridad estricta de contratos y sincronización Offline-First en localStorage (useRoutineLocalStorage) con guardado transaccional por lote (Batch Save) para Pirro-System. Usar siempre al crear servicios de datos, flujos de autenticación, componentes de entrenamiento del alumno o tests de paridad.
---

# Proveedor Dual (Mock <-> Supabase) y Sincronización Offline-First

## 1. Regla de Oro (Constitución I.3 y II.3)
1. **Cero Acoplamiento Directo**: Ningún componente de React (`src/features/**/components/`) puede importar `@supabase/supabase-js` ni leer `localStorage` crudo directamente.
2. **Desarrollo Dual Portátil**: El sistema debe funcionar al 100% en cualquier computadora sin Docker (`VITE_DATA_MODE=mock`) usando un estado semilla persistido en `localStorage` (`pirro_mock_db_v1`), y cambiar de forma transparente a Supabase real (`VITE_DATA_MODE=supabase` apuntando a Supabase CLI Local o a Supabase Cloud `pirro-dev` / `pirro-prod`) sin tocar ni una línea de los componentes UI.
3. **Cero Llamadas de Red por Serie en el Gimnasio**: Durante la sesión de entrenamiento del alumno, cada serie cargada en el Modal se guarda únicamente en el borrador local (`useRoutineLocalStorage`). Recién al presionar **"Guardar"** se ejecuta una única llamada `entrenamientoService.guardarBatch(payload)`.

---

## 2. Patrones Recomendados

### A. Selector de Proveedor (`src/services/dataProvider.js`)
Cada módulo de servicio delega en la implementación activa según `VITE_DATA_MODE` (o un override de desarrollo en `localStorage` para alternar desde la UI en modo `DEV`):

```javascript
import { mockAdapter } from './adapters/mockAdapter'
import { supabaseAdapter } from './adapters/supabaseAdapter'

export function getActiveDataMode() {
  if (import.meta.env.DEV) {
    const devOverride = localStorage.getItem('pirro_dev_data_mode')
    if (devOverride === 'mock' || devOverride === 'supabase') return devOverride
  }
  return import.meta.env.VITE_DATA_MODE || 'mock'
}

export function getProvider() {
  return getActiveDataMode() === 'supabase' ? supabaseAdapter : mockAdapter
}
```

### B. Contrato Idéntico del Modelo Relacional en Mock y Supabase
Tanto `mockAdapter` como `supabaseAdapter` deben devolver y recibir exactamente la misma forma relacional:
- `usuarios`: `{ id, nombre_usuario, email, estado, ultimo_acceso }`
- `personas`: `{ id, id_usuario, rol: 'profesor' | 'alumno', nombre, apellido, fecha_nacimiento, telefono, url_foto, estado }`
- `perfil_alumno`: `{ id_persona, id_profesor, id_gimnasio, altura_cm, peso_kg, salud_enfermedades, fecha_ingreso, cantidad_dias_rutina, comentario }`
- `gimnasios` + `equipamiento` + `gimnasio_equipamiento`
- `ejercicios`
- `rutinas` + `rutina_ejercicios`
- `registros_rutina` + `detalle_series`

### C. Hook `useRoutineLocalStorage` (Borrador por Serie + Payload Batch)
Indexa el borrador por `pirro_draft_${idAlumno}_${idRutina}` e incluye un `clientSubmissionId` (`crypto.randomUUID()`) para garantizar idempotencia si el alumno presiona "Guardar" con señal inestable en el gimnasio.

---

## 3. Lo que NO se debe hacer
- **PROHIBIDO** hacer `INSERT` o `UPDATE` a la base de datos cuando el alumno cierra el modal de una serie individual.
- **PROHIBIDO** inventar nombres de campos en el `mockAdapter` distintos a las columnas SQL de Supabase (ej. usar `studentName` en Mock y `nombre` en Supabase). Ambos deben usar exactamente los nombres del esquema relacional.
- **PROHIBIDO** borrar el borrador de `localStorage` antes de que `guardarBatch(payload)` confirme éxito (`{ ok: true, idRegistro }`).
