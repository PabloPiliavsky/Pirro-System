-- =============================================================================
-- PIRRO-SYSTEM — MIGRACIÓN 001: ESQUEMA RELACIONAL COMPLETO E ÍNDICES
-- Anchored to REQ-FND-004, REQ-FND-005, REQ-FND-006
-- =============================================================================

-- 1. TABLA: usuarios (Credenciales y datos de acceso) — REQ-FND-004
CREATE TABLE IF NOT EXISTS public.usuarios (
  id BIGSERIAL PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  nombre_usuario VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  estado BOOLEAN NOT NULL DEFAULT true,
  ultimo_acceso TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA: personas (Identidad civil y rol 1:1 con usuarios) — REQ-FND-004
CREATE TABLE IF NOT EXISTS public.personas (
  id BIGSERIAL PRIMARY KEY,
  id_usuario BIGINT UNIQUE NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('profesor', 'alumno')),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE,
  telefono VARCHAR(40),
  url_foto TEXT,
  estado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLA: gimnasios (Sedes administradas por el profesor) — REQ-FND-005
CREATE TABLE IF NOT EXISTS public.gimnasios (
  id BIGSERIAL PRIMARY KEY,
  id_profesor BIGINT NOT NULL REFERENCES public.personas(id) ON DELETE RESTRICT,
  nombre VARCHAR(120) NOT NULL,
  direccion VARCHAR(255),
  horario_apertura TIME,
  horario_cierre TIME,
  estado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABLA: perfil_alumno (Extensión 1:1 de personas cuando rol = 'alumno') — REQ-FND-004
CREATE TABLE IF NOT EXISTS public.perfil_alumno (
  id_persona BIGINT PRIMARY KEY REFERENCES public.personas(id) ON DELETE CASCADE,
  id_profesor BIGINT NOT NULL REFERENCES public.personas(id) ON DELETE RESTRICT,
  id_gimnasio BIGINT REFERENCES public.gimnasios(id) ON DELETE SET NULL,
  altura_cm NUMERIC(5,2) CHECK (altura_cm IS NULL OR altura_cm > 0),
  peso_kg NUMERIC(5,2) CHECK (peso_kg IS NULL OR peso_kg > 0),
  salud_enfermedades TEXT,
  fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
  cantidad_dias_rutina SMALLINT NOT NULL DEFAULT 3 CHECK (cantidad_dias_rutina BETWEEN 1 AND 7),
  comentario TEXT
);

-- 5. TABLA: equipamiento (Catálogo maestro de máquinas, pesos libres, accesorios y cardio) — REQ-FND-005
CREATE TABLE IF NOT EXISTS public.equipamiento (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(30) NOT NULL CHECK (categoria IN ('maquina', 'peso_libre', 'accesorio', 'cardio')),
  descripcion TEXT
);

-- 6. TABLA: gimnasio_equipamiento (Relación N:M entre gimnasios y equipamiento disponible) — REQ-FND-005
CREATE TABLE IF NOT EXISTS public.gimnasio_equipamiento (
  id BIGSERIAL PRIMARY KEY,
  id_gimnasio BIGINT NOT NULL REFERENCES public.gimnasios(id) ON DELETE CASCADE,
  id_equipamiento BIGINT NOT NULL REFERENCES public.equipamiento(id) ON DELETE CASCADE,
  cantidad SMALLINT NOT NULL DEFAULT 1 CHECK (cantidad >= 1),
  observaciones TEXT,
  estado BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT uq_gimnasio_equipamiento UNIQUE (id_gimnasio, id_equipamiento)
);

-- 7. TABLA: ejercicios (Catálogo de ejercicios del profesor) — REQ-FND-005
CREATE TABLE IF NOT EXISTS public.ejercicios (
  id BIGSERIAL PRIMARY KEY,
  id_profesor BIGINT NOT NULL REFERENCES public.personas(id) ON DELETE RESTRICT,
  nombre VARCHAR(150) NOT NULL,
  grupo_muscular VARCHAR(80) NOT NULL,
  requiere_equipamiento BOOLEAN NOT NULL DEFAULT false,
  id_equipamiento_requerido BIGINT REFERENCES public.equipamiento(id) ON DELETE SET NULL,
  indicaciones TEXT,
  url_video TEXT,
  estado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TABLA: rutinas (Planificación semanal por alumno y día) — REQ-FND-006
CREATE TABLE IF NOT EXISTS public.rutinas (
  id BIGSERIAL PRIMARY KEY,
  id_alumno BIGINT NOT NULL REFERENCES public.perfil_alumno(id_persona) ON DELETE CASCADE,
  id_profesor BIGINT NOT NULL REFERENCES public.personas(id) ON DELETE RESTRICT,
  numero_dia SMALLINT NOT NULL CHECK (numero_dia BETWEEN 1 AND 7),
  nombre_rutina VARCHAR(120) NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. TABLA: rutina_ejercicios (Ejercicios ordenados dentro de una rutina) — REQ-FND-006
CREATE TABLE IF NOT EXISTS public.rutina_ejercicios (
  id BIGSERIAL PRIMARY KEY,
  id_rutina BIGINT NOT NULL REFERENCES public.rutinas(id) ON DELETE CASCADE,
  id_ejercicio BIGINT NOT NULL REFERENCES public.ejercicios(id) ON DELETE RESTRICT,
  orden SMALLINT NOT NULL CHECK (orden >= 1),
  series_objetivo SMALLINT NOT NULL CHECK (series_objetivo >= 1),
  repeticiones_objetivo VARCHAR(40) NOT NULL,
  notas_profesor TEXT
);

-- 10. TABLA: registros_rutina (Cabecera de sesión realizada por el alumno con clave de idempotencia) — REQ-FND-006
CREATE TABLE IF NOT EXISTS public.registros_rutina (
  id BIGSERIAL PRIMARY KEY,
  client_submission_id UUID UNIQUE NOT NULL,
  id_alumno BIGINT NOT NULL REFERENCES public.perfil_alumno(id_persona) ON DELETE CASCADE,
  id_rutina BIGINT NOT NULL REFERENCES public.rutinas(id) ON DELETE RESTRICT,
  fecha_realizacion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. TABLA: detalle_series (Detalle de cada serie ejecutada en una sesión) — REQ-FND-006
CREATE TABLE IF NOT EXISTS public.detalle_series (
  id BIGSERIAL PRIMARY KEY,
  id_registro_rutina BIGINT NOT NULL REFERENCES public.registros_rutina(id) ON DELETE CASCADE,
  id_ejercicio BIGINT NOT NULL REFERENCES public.ejercicios(id) ON DELETE RESTRICT,
  numero_serie SMALLINT NOT NULL CHECK (numero_serie >= 1),
  repeticiones_objetivo VARCHAR(40),
  repeticiones_realizadas SMALLINT NOT NULL CHECK (repeticiones_realizadas >= 0),
  peso_utilizado NUMERIC(6,2) NOT NULL CHECK (peso_utilizado >= 0),
  comentario_alumno TEXT
);

-- =============================================================================
-- ÍNDICES B-TREE EN TODAS LAS CLAVES FORÁNEAS Y ACCESOS FRECUENTES (REQ-FND-007)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_user_id ON public.usuarios(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_personas_id_usuario ON public.personas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_personas_rol ON public.personas(rol);
CREATE INDEX IF NOT EXISTS idx_gimnasios_id_profesor ON public.gimnasios(id_profesor);
CREATE INDEX IF NOT EXISTS idx_perfil_alumno_id_profesor ON public.perfil_alumno(id_profesor);
CREATE INDEX IF NOT EXISTS idx_perfil_alumno_id_gimnasio ON public.perfil_alumno(id_gimnasio);
CREATE INDEX IF NOT EXISTS idx_gimnasio_equip_id_gimnasio ON public.gimnasio_equipamiento(id_gimnasio);
CREATE INDEX IF NOT EXISTS idx_gimnasio_equip_id_equipamiento ON public.gimnasio_equipamiento(id_equipamiento);
CREATE INDEX IF NOT EXISTS idx_ejercicios_id_profesor ON public.ejercicios(id_profesor);
CREATE INDEX IF NOT EXISTS idx_ejercicios_id_equipamiento ON public.ejercicios(id_equipamiento_requerido);
CREATE INDEX IF NOT EXISTS idx_rutinas_id_alumno ON public.rutinas(id_alumno);
CREATE INDEX IF NOT EXISTS idx_rutinas_id_profesor ON public.rutinas(id_profesor);
CREATE INDEX IF NOT EXISTS idx_rutina_ejercicios_id_rutina ON public.rutina_ejercicios(id_rutina);
CREATE INDEX IF NOT EXISTS idx_rutina_ejercicios_id_ejercicio ON public.rutina_ejercicios(id_ejercicio);
CREATE INDEX IF NOT EXISTS idx_registros_rutina_id_alumno ON public.registros_rutina(id_alumno);
CREATE INDEX IF NOT EXISTS idx_registros_rutina_id_rutina ON public.registros_rutina(id_rutina);
CREATE INDEX IF NOT EXISTS idx_detalle_series_id_registro ON public.detalle_series(id_registro_rutina);
CREATE INDEX IF NOT EXISTS idx_detalle_series_id_ejercicio ON public.detalle_series(id_ejercicio);
