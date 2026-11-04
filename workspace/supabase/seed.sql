-- =============================================================================
-- PIRRO-SYSTEM — SEED.SQL (DATOS SEMILLA REPRODUCIBLES)
-- Anchored to REQ-FND-009
-- Espejo exacto de workspace/frontend/src/services/seed/mockSeedData.js
-- =============================================================================

-- 0. USUARIOS EN AUTH.USERS Y AUTH.IDENTITIES (Supabase Auth Local / Docker)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'leandro@pirrosystem.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Leandro","apellido":"Pirro"}',
    false,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'martin.gomez@alumno.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Martín","apellido":"Gómez"}',
    false,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated',
    'authenticated',
    'lucia.fernandez@alumno.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Lucía","apellido":"Fernández"}',
    false,
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    json_build_object('sub', '11111111-1111-4111-8111-111111111111', 'email', 'leandro@pirrosystem.com')::jsonb,
    'email',
    '11111111-1111-4111-8111-111111111111',
    now(),
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    json_build_object('sub', '22222222-2222-4222-8222-222222222222', 'email', 'martin.gomez@alumno.com')::jsonb,
    'email',
    '22222222-2222-4222-8222-222222222222',
    now(),
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    json_build_object('sub', '33333333-3333-4333-8333-333333333333', 'email', 'lucia.fernandez@alumno.com')::jsonb,
    'email',
    '33333333-3333-4333-8333-333333333333',
    now(),
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- 1. USUARIOS (1 Profesor + 2 Alumnos)
INSERT INTO public.usuarios (id, auth_user_id, nombre_usuario, email, password_hash, estado, ultimo_acceso)
VALUES
  (1, '11111111-1111-4111-8111-111111111111', 'leandro.pirro', 'leandro@pirrosystem.com', 'hashed_demo_profesor', true, '2026-10-08T10:00:00Z'),
  (2, '22222222-2222-4222-8222-222222222222', 'martin.gomez', 'martin.gomez@alumno.com', 'hashed_demo_alumno1', true, '2026-10-08T14:30:00Z'),
  (3, '33333333-3333-4333-8333-333333333333', 'lucia.fernandez', 'lucia.fernandez@alumno.com', 'hashed_demo_alumno2', true, '2026-10-07T19:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- 2. PERSONAS (Vínculo 1:1 con usuarios + definición de rol)
INSERT INTO public.personas (id, id_usuario, rol, nombre, apellido, fecha_nacimiento, telefono, url_foto, estado)
VALUES
  (1, 1, 'profesor', 'Leandro', 'Pirro', '1988-04-12', '+54 9 11 5555-0101', NULL, true),
  (2, 2, 'alumno', 'Martín', 'Gómez', '1996-08-23', '+54 9 11 5555-0202', NULL, true),
  (3, 3, 'alumno', 'Lucía', 'Fernández', '1999-11-05', '+54 9 11 5555-0303', NULL, true)
ON CONFLICT (id) DO NOTHING;

-- 3. GIMNASIOS (Sedes donde entrenan los alumnos)
INSERT INTO public.gimnasios (id, id_profesor, nombre, direccion, horario_apertura, horario_cierre, estado)
VALUES
  (1, 1, 'Iron Temple Palermo', 'Av. Santa Fe 4120, CABA', '07:00:00', '22:30:00', true),
  (2, 1, 'Megatlon Caballito', 'Av. Acoyte 540, CABA', '06:30:00', '23:00:00', true)
ON CONFLICT (id) DO NOTHING;

-- 4. PERFIL_ALUMNO (Extensión 1:1 de personas para rol = 'alumno')
INSERT INTO public.perfil_alumno (id_persona, id_profesor, id_gimnasio, altura_cm, peso_kg, salud_enfermedades, fecha_ingreso, cantidad_dias_rutina, comentario)
VALUES
  (2, 1, 1, 178.00, 79.50, 'Sin lesiones activas. Leve molestia previa en hombro derecho.', '2026-03-10', 3, 'Objetivo hipertrofia tren superior y fuerza base.'),
  (3, 1, 2, 165.00, 61.00, 'Apto médico vigente sin restricciones.', '2026-05-18', 4, 'Enfoque en fuerza de tren inferior y estabilidad de core.')
ON CONFLICT (id_persona) DO NOTHING;

-- 5. EQUIPAMIENTO (Catálogo de elementos y máquinas)
INSERT INTO public.equipamiento (id, nombre, categoria, descripcion)
VALUES
  (1, 'Rack de Sentadilla Olímpico', 'peso_libre', 'Jaula de potencia con barras olímpicas de 20kg'),
  (2, 'Banco Plano e Inclinado con Mancuernas', 'peso_libre', 'Bancos regulables y mancuernas de 2.5kg a 45kg'),
  (3, 'Polea Doble Regulable (Crossover)', 'maquina', 'Torre de poleas enfrentadas con accesorios'),
  (4, 'Camilla de Isquiotibiales Sentado', 'maquina', 'Máquina específica de flexión femoral sentado'),
  (5, 'Prensa 45 Grados', 'maquina', 'Prensa inclinada a discos para tren inferior')
ON CONFLICT (id) DO NOTHING;

-- 6. GIMNASIO_EQUIPAMIENTO (Disponibilidad por sede — cantidad 1 por defecto)
INSERT INTO public.gimnasio_equipamiento (id, id_gimnasio, id_equipamiento, cantidad, observaciones, estado)
VALUES
  (1, 1, 1, 1, 'Barras calibradas disponibles', true),
  (2, 1, 2, 1, 'Mancuernas completas', true),
  (3, 1, 3, 1, 'Poleas regulables', true),
  (4, 1, 4, 1, 'Exclusiva en sede Palermo', true),
  (5, 1, 5, 1, 'Prensa pesada', true),
  (6, 2, 1, 1, 'Sector peso libre subsuelo', true),
  (7, 2, 2, 1, 'Mancuernas completas', true),
  (8, 2, 3, 1, 'Planta principal', true),
  (9, 2, 5, 1, 'Prensa estándar', true)
ON CONFLICT (id) DO NOTHING;

-- 7. EJERCICIOS (Catálogo del profesor Leandro Pirro)
INSERT INTO public.ejercicios (id, id_profesor, nombre, grupo_muscular, requiere_equipamiento, id_equipamiento_requerido, indicaciones, url_video, estado)
VALUES
  (1, 1, 'Press Plano con Mancuernas', 'Pectorales', true, 2, 'Retracción escapular constante, bajar controlado en 2 segundos.', 'https://youtube.com/watch?v=demo1', true),
  (2, 1, 'Remo en Polea Baja con Triángulo', 'Espalda', true, 3, 'Pecho alto, llevar el agarre al abdomen bajo sin balancear torso.', 'https://youtube.com/watch?v=demo2', true),
  (3, 1, 'Sentadilla Libre con Barra', 'Cuádriceps / Glúteos', true, 1, 'Profundidad rompiendo paralelo manteniendo presión abdominal.', 'https://youtube.com/watch?v=demo3', true),
  (4, 1, 'Camilla Femoral Sentado', 'Isquiotibiales', true, 4, 'Pausa de 1 segundo en máxima contracción.', 'https://youtube.com/watch?v=demo4', true),
  (5, 1, 'Prensa 45 Grados', 'Cuádriceps', true, 5, 'Pies ancho de hombros, no bloquear rodillas arriba.', 'https://youtube.com/watch?v=demo5', true),
  (6, 1, 'Plancha Abdominal RKC', 'Core / Zona Media', false, NULL, 'Contracción máxima de glúteos y abdomen durante 30-45 seg.', NULL, true)
ON CONFLICT (id) DO NOTHING;

-- 8. RUTINAS SEMANALES
INSERT INTO public.rutinas (id, id_alumno, id_profesor, numero_dia, nombre_rutina, activa)
VALUES
  (1, 2, 1, 1, 'Día 1 — Fuerza e Hipertrofia Tren Superior', true),
  (2, 2, 1, 2, 'Día 2 — Potencia Tren Inferior & Core', true),
  (3, 3, 1, 1, 'Día 1 — Énfasis Tren Inferior & Glúteos', true)
ON CONFLICT (id) DO NOTHING;

-- 9. RUTINA_EJERCICIOS
INSERT INTO public.rutina_ejercicios (id, id_rutina, id_ejercicio, orden, series_objetivo, repeticiones_objetivo, notas_profesor)
VALUES
  (1, 1, 1, 1, 4, '8-10', 'Subir 2.5kg si completás las 4 series de 10 con buena técnica.'),
  (2, 1, 2, 2, 4, '10-12', 'Controlar la fase excéntrica.'),
  (3, 1, 6, 3, 3, '40 seg', 'Descanso corto de 45 segundos entre series.'),
  (4, 2, 3, 1, 4, '6-8', 'Priorizar velocidad de subida.'),
  (5, 2, 4, 2, 3, '12', 'Aislar isquiotibiales sin despegar cadera.'),
  (6, 3, 3, 1, 4, '8', 'Serie de aproximación previa obligatoria.'),
  (7, 3, 5, 2, 4, '10-12', 'Rango completo de movimiento.')
ON CONFLICT (id) DO NOTHING;

-- 10. REGISTROS_RUTINA Y DETALLE_SERIES (Sesión histórica semilla)
INSERT INTO public.registros_rutina (id, client_submission_id, id_alumno, id_rutina, fecha_realizacion)
VALUES
  (1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 1, '2026-10-06')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.detalle_series (id, id_registro_rutina, id_ejercicio, numero_serie, repeticiones_objetivo, repeticiones_realizadas, peso_utilizado, comentario_alumno)
VALUES
  (1, 1, 1, 1, '8-10', 10, 30.00, 'Muy firme el primer set'),
  (2, 1, 1, 2, '8-10', 10, 32.50, 'Subí a mancuernas de 32.5kg'),
  (3, 1, 1, 3, '8-10', 9, 32.50, NULL),
  (4, 1, 1, 4, '8-10', 8, 32.50, 'Al fallo técnico en la última'),
  (5, 1, 2, 1, '10-12', 12, 65.00, 'Buen agarre'),
  (6, 1, 2, 2, '10-12', 11, 70.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencias de PostgreSQL
SELECT setval('public.usuarios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.usuarios));
SELECT setval('public.personas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.personas));
SELECT setval('public.gimnasios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.gimnasios));
SELECT setval('public.equipamiento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.equipamiento));
SELECT setval('public.gimnasio_equipamiento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.gimnasio_equipamiento));
SELECT setval('public.ejercicios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.ejercicios));
SELECT setval('public.rutinas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.rutinas));
SELECT setval('public.rutina_ejercicios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.rutina_ejercicios));
SELECT setval('public.registros_rutina_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.registros_rutina));
SELECT setval('public.detalle_series_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.detalle_series));
