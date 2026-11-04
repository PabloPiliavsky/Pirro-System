-- =============================================================================
-- PIRRO-SYSTEM — MIGRACIÓN 003: FUNCIONES DE RESOLUCIÓN PARA SUPABASE AUTH
-- Anchored to REQ-AUTH-001, REQ-AUTH-015
-- =============================================================================

CREATE OR REPLACE FUNCTION public.resolve_user_email_by_identifier(p_identifier text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF p_identifier IS NULL OR trim(p_identifier) = '' THEN
    RETURN NULL;
  END IF;

  -- Si contiene '@', se busca por email insensible a mayúsculas
  IF position('@' in p_identifier) > 0 THEN
    SELECT u.email INTO v_email
    FROM public.usuarios u
    JOIN public.personas p ON p.id_usuario = u.id
    WHERE lower(u.email) = lower(trim(p_identifier))
      AND u.estado = true
      AND p.estado = true
    LIMIT 1;
  ELSE
    -- Si no tiene '@', se busca por nombre_usuario insensible a mayúsculas
    SELECT u.email INTO v_email
    FROM public.usuarios u
    JOIN public.personas p ON p.id_usuario = u.id
    WHERE lower(u.nombre_usuario) = lower(trim(p_identifier))
      AND u.estado = true
      AND p.estado = true
    LIMIT 1;
  END IF;

  RETURN v_email;
END;
$$;

-- Permitir que usuarios no autenticados (anon) resuelvan su email para el login
GRANT EXECUTE ON FUNCTION public.resolve_user_email_by_identifier(text) TO anon, authenticated;
