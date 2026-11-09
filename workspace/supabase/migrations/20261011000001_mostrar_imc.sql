-- =============================================================================
-- PIRRO-SYSTEM — MIGRACIÓN 005: CAMPO MOSTRAR_IMC EN PERFIL_ALUMNO Y ACTUALIZACIÓN RPC
-- =============================================================================

ALTER TABLE public.perfil_alumno
ADD COLUMN IF NOT EXISTS mostrar_imc BOOLEAN NOT NULL DEFAULT false;

-- Actualizar la función RPC alta_alumno_profesor para soportar mostrar_imc
CREATE OR REPLACE FUNCTION public.alta_alumno_profesor(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id_profesor BIGINT;
  v_rol VARCHAR(20);
  v_nombre TEXT;
  v_apellido TEXT;
  v_nombre_usuario TEXT;
  v_email TEXT;
  v_password TEXT;
  v_telefono TEXT;
  v_fecha_nacimiento DATE;
  v_url_foto TEXT;
  v_id_gimnasio BIGINT;
  v_altura_cm NUMERIC(5,2);
  v_peso_kg NUMERIC(5,2);
  v_salud_enfermedades TEXT;
  v_fecha_ingreso DATE;
  v_dias_rutina SMALLINT;
  v_mostrar_imc BOOLEAN;
  v_comentario TEXT;
  v_id_usuario BIGINT;
  v_id_persona BIGINT;
BEGIN
  -- 1. Verificar identidad y rol del profesor invocador
  v_id_profesor := public.get_my_persona_id();
  v_rol := public.get_my_role();

  IF v_id_profesor IS NULL OR v_rol <> 'profesor' THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'UNAUTHORIZED_PROFESOR_ONLY',
        'message', 'Solo un profesor autenticado y activo puede registrar alumnos.'
      )
    );
  END IF;

  -- 2. Extracción de campos y valores defensivos
  v_nombre := trim(COALESCE(payload->>'nombre', ''));
  v_apellido := trim(COALESCE(payload->>'apellido', ''));
  v_nombre_usuario := trim(COALESCE(payload->>'nombre_usuario', ''));
  v_email := lower(trim(COALESCE(payload->>'email', '')));
  v_password := COALESCE(payload->>'password', 'Pirro123!');
  v_telefono := NULLIF(trim(COALESCE(payload->>'telefono', '')), '');
  v_url_foto := NULLIF(trim(COALESCE(payload->>'url_foto', '')), '');
  v_salud_enfermedades := NULLIF(trim(COALESCE(payload->>'salud_enfermedades', '')), '');
  v_comentario := NULLIF(trim(COALESCE(payload->>'comentario', '')), '');
  v_mostrar_imc := COALESCE((payload->>'mostrar_imc')::BOOLEAN, false);

  IF (payload->>'fecha_nacimiento') IS NOT NULL AND trim(payload->>'fecha_nacimiento') <> '' THEN
    v_fecha_nacimiento := (payload->>'fecha_nacimiento')::DATE;
  ELSE
    v_fecha_nacimiento := NULL;
  END IF;

  IF (payload->>'fecha_ingreso') IS NOT NULL AND trim(payload->>'fecha_ingreso') <> '' THEN
    v_fecha_ingreso := (payload->>'fecha_ingreso')::DATE;
  ELSE
    v_fecha_ingreso := CURRENT_DATE;
  END IF;

  IF (payload->>'id_gimnasio') IS NOT NULL AND trim(payload->>'id_gimnasio') <> '' THEN
    v_id_gimnasio := (payload->>'id_gimnasio')::BIGINT;
  ELSE
    v_id_gimnasio := NULL;
  END IF;

  IF (payload->>'altura_cm') IS NOT NULL AND trim(payload->>'altura_cm') <> '' THEN
    v_altura_cm := (payload->>'altura_cm')::NUMERIC;
  ELSE
    v_altura_cm := NULL;
  END IF;

  IF (payload->>'peso_kg') IS NOT NULL AND trim(payload->>'peso_kg') <> '' THEN
    v_peso_kg := (payload->>'peso_kg')::NUMERIC;
  ELSE
    v_peso_kg := NULL;
  END IF;

  v_dias_rutina := COALESCE((payload->>'cantidad_dias_rutina')::SMALLINT, 3::SMALLINT);

  -- 3. Validaciones
  IF v_nombre = '' OR v_apellido = '' OR v_nombre_usuario = '' OR v_email = '' THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'INVALID_ALUMNO_DATA',
        'message', 'Los campos nombre, apellido, nombre_usuario y email son obligatorios.'
      )
    );
  END IF;

  IF v_dias_rutina < 1 OR v_dias_rutina > 7 THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'INVALID_ALUMNO_DATA',
        'message', 'La cantidad de días de rutina debe estar entre 1 y 7.'
      )
    );
  END IF;

  -- 4. Control de credenciales duplicadas
  IF EXISTS (SELECT 1 FROM public.usuarios WHERE lower(email) = v_email) THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'DUPLICATE_USER_CREDENTIALS',
        'message', 'El correo electrónico ya se encuentra registrado.'
      )
    );
  END IF;

  IF EXISTS (SELECT 1 FROM public.usuarios WHERE lower(nombre_usuario) = lower(v_nombre_usuario)) THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', jsonb_build_object(
        'code', 'DUPLICATE_USER_CREDENTIALS',
        'message', 'El nombre de usuario ya se encuentra registrado.'
      )
    );
  END IF;

  -- 5. Inserción en usuarios
  INSERT INTO public.usuarios (
    nombre_usuario,
    email,
    password_hash,
    estado
  ) VALUES (
    v_nombre_usuario,
    v_email,
    v_password,
    true
  )
  RETURNING id INTO v_id_usuario;

  -- 6. Inserción en personas
  INSERT INTO public.personas (
    id_usuario,
    rol,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    url_foto,
    estado
  ) VALUES (
    v_id_usuario,
    'alumno',
    v_nombre,
    v_apellido,
    v_fecha_nacimiento,
    v_telefono,
    v_url_foto,
    true
  )
  RETURNING id INTO v_id_persona;

  -- 7. Inserción en perfil_alumno
  INSERT INTO public.perfil_alumno (
    id_persona,
    id_profesor,
    id_gimnasio,
    altura_cm,
    peso_kg,
    salud_enfermedades,
    fecha_ingreso,
    cantidad_dias_rutina,
    mostrar_imc,
    comentario
  ) VALUES (
    v_id_persona,
    v_id_profesor,
    v_id_gimnasio,
    v_altura_cm,
    v_peso_kg,
    v_salud_enfermedades,
    v_fecha_ingreso,
    v_dias_rutina,
    v_mostrar_imc,
    v_comentario
  );

  RETURN jsonb_build_object(
    'ok', true,
    'id_persona', v_id_persona,
    'id_usuario', v_id_usuario
  );
END;
$$;
