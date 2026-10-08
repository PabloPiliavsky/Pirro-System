---
name: supabase-postgres-rls-rpc
description: Arquitectura PostgreSQL en Supabase para Pirro-System. Cubre el esquema relacional (usuarios -> personas -> perfil_alumno, gimnasios, equipamiento, ejercicios, rutinas, registros_rutina, detalle_series), políticas Row Level Security (RLS) por rol ('profesor' vs 'alumno'), funciones transaccionales RPC (guardar_entrenamiento_batch y alta de alumnos) y pruebas en Supabase Local CLI o Cloud Staging (pirro-dev).
---

# Supabase PostgreSQL, RLS y Funciones Transaccionales (RPC)

## 1. Regla de Oro (Constitución I.2 y II.1)
1. **Separación `usuarios` -> `personas` -> `perfil_alumno`**:
   - `public.usuarios` almacena las credenciales y vínculo con `auth.users` (`id`, `auth_user_id`, `nombre_usuario`, `email`, `estado`, `ultimo_acceso`).
   - `public.personas` se relaciona 1:1 con `usuarios` (`id_usuario`) y define el `rol` (`'profesor' | 'alumno'`) junto a los datos personales (`nombre`, `apellido`, `fecha_nacimiento`, `telefono`, `url_foto`, `estado`).
   - `public.perfil_alumno` extiende 1:1 a `personas` (`id_persona`) cuando `rol = 'alumno'`, vinculando `id_profesor`, `id_gimnasio`, `altura_cm`, `peso_kg`, `salud_enfermedades`, `fecha_ingreso`, `cantidad_dias_rutina` y `comentario`.
2. **Row Level Security (RLS) Obligatorio**: Ninguna tabla del esquema `public` puede quedar sin `ENABLE ROW LEVEL SECURITY`.
3. **Guardado de Entrenamiento en 1 Transacción RPC**: El guardado final de la planilla del alumno se ejecuta mediante la función SQL `public.guardar_entrenamiento_batch(payload jsonb)` que inserta en `registros_rutina` y `detalle_series` de forma atómica e idempotente (`client_submission_id`).

---

## 2. Patrones Recomendados

### A. Función Auxiliar de Rol en PostgreSQL (para RLS rápido)
```sql
CREATE OR REPLACE FUNCTION public.get_my_persona_id()
RETURNS BIGINT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT p.id
  FROM public.personas p
  JOIN public.usuarios u ON u.id = p.id_usuario
  WHERE u.auth_user_id = auth.uid() AND u.estado = true AND p.estado = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS VARCHAR LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT p.rol
  FROM public.personas p
  JOIN public.usuarios u ON u.id = p.id_usuario
  WHERE u.auth_user_id = auth.uid() AND u.estado = true AND p.estado = true
  LIMIT 1;
$$;
```

### B. Función Transaccional `guardar_entrenamiento_batch`
```sql
CREATE OR REPLACE FUNCTION public.guardar_entrenamiento_batch(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id_registro BIGINT;
  v_client_sub_id UUID := (payload->>'clientSubmissionId')::UUID;
  v_id_alumno BIGINT := (payload->>'idAlumno')::BIGINT;
  v_id_rutina BIGINT := (payload->>'idRutina')::BIGINT;
  v_fecha DATE := (payload->>'fechaRealizacion')::DATE;
  v_serie jsonb;
BEGIN
  -- 1. Idempotencia: si ya se procesó este clientSubmissionId, devolver el registro existente
  SELECT id INTO v_id_registro
  FROM public.registros_rutina
  WHERE client_submission_id = v_client_sub_id;

  IF v_id_registro IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'idRegistro', v_id_registro, 'idempotent', true);
  END IF;

  -- 2. Insertar cabecera de sesión
  INSERT INTO public.registros_rutina (client_submission_id, id_alumno, id_rutina, fecha_realizacion)
  VALUES (v_client_sub_id, v_id_alumno, v_id_rutina, v_fecha)
  RETURNING id INTO v_id_registro;

  -- 3. Insertar todas las series en bloque dentro de la misma transacción
  FOR v_serie IN SELECT * FROM jsonb_array_elements(payload->'series')
  LOOP
    INSERT INTO public.detalle_series (
      id_registro_rutina,
      id_ejercicio,
      numero_serie,
      repeticiones_objetivo,
      repeticiones_realizadas,
      peso_utilizado,
      comentario_alumno
    ) VALUES (
      v_id_registro,
      (v_serie->>'idEjercicio')::BIGINT,
      (v_serie->>'numeroSerie')::SMALLINT,
      v_serie->>'repeticionesObjetivo',
      (v_serie->>'repeticionesRealizadas')::SMALLINT,
      (v_serie->>'pesoUtilizado')::NUMERIC(6,2),
      v_serie->>'comentarioAlumno'
    );
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'idRegistro', v_id_registro, 'idempotent', false);
END;
$$;
```

### C. Modos de Prueba con Supabase (Con o Sin Docker)
- **En PC sin Docker**: Conectar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` al proyecto gratuito de pruebas en la nube (`pirro-dev`), o usar `VITE_DATA_MODE=mock`.
- **En PC con Docker**: Usar `npx supabase start` y `npx supabase db reset` con `workspace/supabase/seed.sql`.

---

## 3. Lo que NO se debe hacer
- **PROHIBIDO** exponer la `SUPABASE_SERVICE_ROLE_KEY` en variables `VITE_*` del frontend.
- **PROHIBIDO** crear cuentas de alumnos usando `supabase.auth.signUp()` directo en el navegador del profesor sin aislar la sesión (usar RPC con `pgcrypto` o un cliente secundario con `persistSession: false`).
