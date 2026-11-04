-- =============================================================================
-- PIRRO-SYSTEM — MIGRACIÓN 002: SEGURIDAD RLS Y FUNCIÓN RPC GUARDADO BATCH
-- Anchored to REQ-FND-007, REQ-FND-008
-- =============================================================================

-- 1. FUNCIONES AUXILIARES DE IDENTIDAD Y ROL (SECURITY DEFINER STABLE) — REQ-FND-007
CREATE OR REPLACE FUNCTION public.get_my_persona_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.personas p
  JOIN public.usuarios u ON u.id = p.id_usuario
  WHERE u.auth_user_id = (SELECT auth.uid())
    AND u.estado = true
    AND p.estado = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS VARCHAR
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.rol
  FROM public.personas p
  JOIN public.usuarios u ON u.id = p.id_usuario
  WHERE u.auth_user_id = (SELECT auth.uid())
    AND u.estado = true
    AND p.estado = true
  LIMIT 1;
$$;

-- 2. HABILITACIÓN OBLIGATORIA DE ROW LEVEL SECURITY EN TODAS LAS TABLAS — REQ-FND-007
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gimnasios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfil_alumno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gimnasio_equipamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutina_ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_rutina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_series ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS RLS POR TABLA Y ROL ('profesor' vs 'alumno') — REQ-FND-007

-- usuarios: El profesor ve usuarios de su cartera o el suyo; el alumno solo ve su propio usuario
CREATE POLICY usuarios_select_policy ON public.usuarios
  FOR SELECT USING (
    (SELECT public.get_my_role()) = 'profesor'
    OR auth_user_id = (SELECT auth.uid())
  );

CREATE POLICY usuarios_profesor_write_policy ON public.usuarios
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

-- personas: El profesor gestiona todas las personas de su cartera; el alumno lee la suya y la de su profesor
CREATE POLICY personas_select_policy ON public.personas
  FOR SELECT USING (
    (SELECT public.get_my_role()) = 'profesor'
    OR id = (SELECT public.get_my_persona_id())
    OR rol = 'profesor'
  );

CREATE POLICY personas_profesor_write_policy ON public.personas
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

-- perfil_alumno: El profesor gestiona su cartera; el alumno solo lee su propio perfil
CREATE POLICY perfil_alumno_select_policy ON public.perfil_alumno
  FOR SELECT USING (
    id_profesor = (SELECT public.get_my_persona_id())
    OR id_persona = (SELECT public.get_my_persona_id())
  );

CREATE POLICY perfil_alumno_profesor_write_policy ON public.perfil_alumno
  FOR ALL USING (id_profesor = (SELECT public.get_my_persona_id()))
  WITH CHECK (id_profesor = (SELECT public.get_my_persona_id()));

-- gimnasios, equipamiento y gimnasio_equipamiento: Lectura para autenticados, escritura exclusiva del profesor
CREATE POLICY gimnasios_select_policy ON public.gimnasios
  FOR SELECT USING ((SELECT public.get_my_persona_id()) IS NOT NULL);

CREATE POLICY gimnasios_profesor_write_policy ON public.gimnasios
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

CREATE POLICY equipamiento_select_policy ON public.equipamiento
  FOR SELECT USING ((SELECT public.get_my_persona_id()) IS NOT NULL);

CREATE POLICY equipamiento_profesor_write_policy ON public.equipamiento
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

CREATE POLICY gimnasio_equipamiento_select_policy ON public.gimnasio_equipamiento
  FOR SELECT USING ((SELECT public.get_my_persona_id()) IS NOT NULL);

CREATE POLICY gimnasio_equipamiento_profesor_write_policy ON public.gimnasio_equipamiento
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

-- ejercicios: Lectura para autenticados, escritura exclusiva del profesor
CREATE POLICY ejercicios_select_policy ON public.ejercicios
  FOR SELECT USING ((SELECT public.get_my_persona_id()) IS NOT NULL);

CREATE POLICY ejercicios_profesor_write_policy ON public.ejercicios
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

-- rutinas y rutina_ejercicios: El profesor administra todo; el alumno lee únicamente sus propias rutinas
CREATE POLICY rutinas_select_policy ON public.rutinas
  FOR SELECT USING (
    id_profesor = (SELECT public.get_my_persona_id())
    OR id_alumno = (SELECT public.get_my_persona_id())
  );

CREATE POLICY rutinas_profesor_write_policy ON public.rutinas
  FOR ALL USING (id_profesor = (SELECT public.get_my_persona_id()))
  WITH CHECK (id_profesor = (SELECT public.get_my_persona_id()));

CREATE POLICY rutina_ejercicios_select_policy ON public.rutina_ejercicios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rutinas r
      WHERE r.id = rutina_ejercicios.id_rutina
        AND (r.id_profesor = (SELECT public.get_my_persona_id()) OR r.id_alumno = (SELECT public.get_my_persona_id()))
    )
  );

CREATE POLICY rutina_ejercicios_profesor_write_policy ON public.rutina_ejercicios
  FOR ALL USING ((SELECT public.get_my_role()) = 'profesor')
  WITH CHECK ((SELECT public.get_my_role()) = 'profesor');

-- registros_rutina y detalle_series: El alumno inserta y lee sus propios registros; el profesor lee y gestiona todos
CREATE POLICY registros_rutina_select_policy ON public.registros_rutina
  FOR SELECT USING (
    (SELECT public.get_my_role()) = 'profesor'
    OR id_alumno = (SELECT public.get_my_persona_id())
  );

CREATE POLICY registros_rutina_insert_policy ON public.registros_rutina
  FOR INSERT WITH CHECK (
    (SELECT public.get_my_role()) = 'profesor'
    OR id_alumno = (SELECT public.get_my_persona_id())
  );

CREATE POLICY detalle_series_select_policy ON public.detalle_series
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.registros_rutina rr
      WHERE rr.id = detalle_series.id_registro_rutina
        AND ((SELECT public.get_my_role()) = 'profesor' OR rr.id_alumno = (SELECT public.get_my_persona_id()))
    )
  );

CREATE POLICY detalle_series_insert_policy ON public.detalle_series
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registros_rutina rr
      WHERE rr.id = detalle_series.id_registro_rutina
        AND ((SELECT public.get_my_role()) = 'profesor' OR rr.id_alumno = (SELECT public.get_my_persona_id()))
    )
  );

-- =============================================================================
-- 4. FUNCIÓN RPC TRANSACCIONAL E IDEMPOTENTE: guardar_entrenamiento_batch
-- Anchored to REQ-FND-008, REQ-FND-012
-- =============================================================================
CREATE OR REPLACE FUNCTION public.guardar_entrenamiento_batch(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id_registro BIGINT;
  v_client_sub_id UUID;
  v_id_alumno BIGINT;
  v_id_rutina BIGINT;
  v_fecha DATE;
  v_series jsonb;
  v_serie jsonb;
BEGIN
  -- 1. Validación defensiva del payload (REQ-FND-012)
  IF payload IS NULL
     OR (payload->>'clientSubmissionId') IS NULL
     OR (payload->>'idAlumno') IS NULL
     OR (payload->>'idRutina') IS NULL
     OR payload->'series' IS NULL
     OR jsonb_typeof(payload->'series') <> 'array'
     OR jsonb_array_length(payload->'series') = 0
  THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'INVALID_BATCH_PAYLOAD',
        'message', 'El payload debe incluir clientSubmissionId, idAlumno, idRutina y al menos una serie.'
      )
    );
  END IF;

  v_client_sub_id := (payload->>'clientSubmissionId')::UUID;
  v_id_alumno := (payload->>'idAlumno')::BIGINT;
  v_id_rutina := (payload->>'idRutina')::BIGINT;
  v_fecha := COALESCE((payload->>'fechaRealizacion')::DATE, CURRENT_DATE);
  v_series := payload->'series';

  -- 2. Verificación de Idempotencia por client_submission_id (REQ-FND-008)
  SELECT id INTO v_id_registro
  FROM public.registros_rutina
  WHERE client_submission_id = v_client_sub_id;

  IF v_id_registro IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok', true,
      'idRegistro', v_id_registro,
      'idempotent', true
    );
  END IF;

  -- 3. Insertar cabecera de sesión en registros_rutina
  INSERT INTO public.registros_rutina (
    client_submission_id,
    id_alumno,
    id_rutina,
    fecha_realizacion
  ) VALUES (
    v_client_sub_id,
    v_id_alumno,
    v_id_rutina,
    v_fecha
  )
  RETURNING id INTO v_id_registro;

  -- 4. Insertar todas las series en bloque dentro de la misma transacción ACID
  FOR v_serie IN SELECT * FROM jsonb_array_elements(v_series)
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
      COALESCE(v_serie->>'repeticionesObjetivo', '10'),
      (v_serie->>'repeticionesRealizadas')::SMALLINT,
      (v_serie->>'pesoUtilizado')::NUMERIC(6,2),
      NULLIF(TRIM(COALESCE(v_serie->>'comentarioAlumno', '')), '')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'ok', true,
    'idRegistro', v_id_registro,
    'idempotent', false
  );
END;
$$;

-- 5. POLÍTICAS TEMPORALES PARA DEMO INICIAL SIN LOGIN (STAGE 001)
-- En Stage 002 se gestionan con tokens JWT de Supabase Auth
CREATE POLICY perfil_alumno_dev_anon_read ON public.perfil_alumno FOR SELECT USING (true);
CREATE POLICY personas_dev_anon_read ON public.personas FOR SELECT USING (true);
CREATE POLICY usuarios_dev_anon_read ON public.usuarios FOR SELECT USING (true);
CREATE POLICY gimnasios_dev_anon_read ON public.gimnasios FOR SELECT USING (true);
CREATE POLICY equipamiento_dev_anon_read ON public.equipamiento FOR SELECT USING (true);
CREATE POLICY gimnasio_equip_dev_anon_read ON public.gimnasio_equipamiento FOR SELECT USING (true);
CREATE POLICY ejercicios_dev_anon_read ON public.ejercicios FOR SELECT USING (true);
CREATE POLICY rutinas_dev_anon_read ON public.rutinas FOR SELECT USING (true);
CREATE POLICY rutina_ejercicios_dev_anon_read ON public.rutina_ejercicios FOR SELECT USING (true);
CREATE POLICY registros_rutina_dev_anon_read ON public.registros_rutina FOR SELECT USING (true);
CREATE POLICY detalle_series_dev_anon_read ON public.detalle_series FOR SELECT USING (true);
