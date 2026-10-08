# Constitución del Proyecto: Pirro-System

## Visión General
**Pirro-System** es una aplicación web responsive (Mobile-First para los alumnos en el gimnasio y optimizada para escritorio/móvil para el profesor) destinada a la gestión integral de entrenamientos personalizados del profesor **Leandro Pirro** y su cartera de alumnos.

---

## I. Principios de Arquitectura y Stack Tecnológico

1. **Stack Frontend (`workspace/frontend/`)**:
   - **Framework**: React 19 (JavaScript `.js` / `.jsx` con ES Modules).
   - **Build Tool**: Vite 8.
   - **Estilos y Componentes**: Tailwind CSS v4 + `shadcn/ui` + `lucide-react`.
   - **Exportación de Datos**: Generación de reportes y planillas en formato `.xlsx` (Excel).
2. **Stack Backend y Base de Datos (BaaS Relacional — Supabase)**:
   - **Base de Datos**: PostgreSQL estándar gestionado en **Supabase** (`workspace/supabase/` para migraciones SQL, políticas RLS, funciones RPC y `seed.sql`).
   - **Autenticación y Seguridad**: Supabase Auth + **Row Level Security (RLS)** obligatorio en todas las tablas del esquema `public`.
   - **Transacciones Atómicas**: Uso de funciones SQL en PostgreSQL (**RPC**) para operaciones complejas o guardados masivos en bloque (`guardar_entrenamiento_batch`).
   - **Prevención de Pausa en Free Tier**: Configuración de keep-alive automatizado (cron cada 72h) para evitar la pausa por inactividad de 7 días en la capa gratuita.
3. **Arquitectura de Desarrollo Dual (`Mock Sin Docker` <-> `Supabase Real`)**:
   - **Objetivo**: Permitir el desarrollo, prueba y demostración del sistema tanto en computadoras **sin Docker ni conexión a base de datos** (`VITE_DATA_MODE=mock`) como contra **Supabase Real** (`VITE_DATA_MODE=supabase`, ya sea en Supabase Local CLI con Docker o en el proyecto gratuito en la nube `pirro-dev` / `pirro-prod`).
   - **Prohibición de Acoplamiento Directo**: Ningún componente de UI o hook visual en React puede importar ni invocar directamente al cliente `@supabase/supabase-js`.
   - **Paridad Estricta de Contrato (`Provider Contract Parity`)**: Cada servicio en `src/services/` debe exponer exactamente los mismos métodos, firmas, validaciones y estructuras de retorno en su implementación `mockAdapter` (persistida en `localStorage` con datos semilla reseteables) y en su implementación `supabaseAdapter` (consultas SQL/PostgREST y llamadas RPC).
   - **Selector / Indicador de Entorno en Desarrollo**: En modo desarrollo (`import.meta.env.DEV`), la interfaz mostrará un indicador discreto del modo activo (`MOCK LOCAL` vs `SUPABASE`) con opción de restaurar los datos semilla del Mock en 1 clic.
4. **Clean Code y Modularización por Features**:
   - Arquitectura organizada por módulos de negocio (`src/features/`).
   - **Single Responsibility Principle (SRP)**: Límite orientativo de **~40 líneas por función/componente** y **~100 líneas por archivo**, sin punto y coma (`;`) y con nombres auto-documentados.

---

## II. Reglas Críticas de Dominio y Modelo Relacional

1. **Separación de Credenciales e Identidad (`usuarios` -> `personas` -> `perfil_alumno`)**:
   - **`usuarios`**: Almacena exclusivamente credenciales y datos de acceso (`id`, `auth_user_id`, `nombre_usuario`, `email`, `password_hash`, `estado`, `ultimo_acceso`).
   - **`personas`**: Vinculada 1:1 con `usuarios`. Contiene la identidad civil (`nombre`, `apellido`, `fecha_nacimiento`, `telefono`, `url_foto`, `estado`) y define el **rol del sistema** (`rol`: `'profesor'` | `'alumno'`).
   - **`perfil_alumno`**: Extensión 1:1 de `personas` (cuando `rol = 'alumno'`) que almacena `id_profesor`, `id_gimnasio`, `altura_cm`, `peso_kg`, `salud_enfermedades`, `fecha_ingreso`, `cantidad_dias_rutina` y `comentario`.
2. **Gimnasios, Equipamiento y Catálogo de Ejercicios**:
   - Cada gimnasio (`gimnasios`) registra sus máquinas y elementos disponibles (`gimnasio_equipamiento` <-> `equipamiento`).
   - El catálogo de `ejercicios` indica músculos trabajados y si requiere máquina/equipamiento específico, permitiendo asistir al profesor al armar rutinas según el gimnasio al que asiste el alumno.
3. **Optimización Crítica en el Gimnasio (Offline-First `localStorage` + Guardado Batch)**:
   - **Cero llamadas a Base de Datos por serie**: Mientras el alumno entrena y carga series en el modal interactivo (repeticiones realizadas, peso utilizado y comentario opcional), todo el progreso se guarda exclusivamente en `localStorage` (mediante `useRoutineLocalStorage`).
   - **Envío Único por Lote (Batch Transaction)**: Recién cuando el alumno presiona el botón **"Guardar"** de la planilla del día, se envía un único payload JSON con clave de idempotencia (`clientSubmissionId`) que inserta la cabecera en `registros_rutina` y todas las filas en `detalle_series` dentro de una única transacción ACID (tanto en el proveedor Mock como en la función RPC de Supabase).

---

## III. Estándar de UI/UX

1. **Experiencia Dual**:
   - **Vista Alumno (100% Mobile-First)**: Pensada para usarse con una sola mano en el gimnasio, botones táctiles amplios (`min-h-11`), grilla clara con tantas columnas como `series_objetivo` tenga cada ejercicio, indicador visual de series completadas en borrador local y modal ágil de carga por serie.
   - **Vista Profesor (Desktop + Mobile)**: Panel de administración ágil para ABM de gimnasios/equipamiento, catálogo de ejercicios, alta de alumnos, constructor de rutinas por día de la semana, historial de progreso y exportación a `.xlsx`.
2. **Identidad Visual**: Uso de componentes `shadcn/ui` personalizados con estética deportiva moderna, alto contraste y excelente legibilidad, evitando plantillas genéricas sin jerarquía visual.

---

## IV. Estrategia de Pruebas Dual y Consulta Obligatoria de Entorno (Docker Gate)

1. **Pregunta Obligatoria Pre-Desarrollo / Pre-Test (`Docker / Supabase Gate`)**:
   - Al comenzar a desarrollar o validar cualquier módulo/feature, el sistema **DEBE preguntar explícitamente al usuario**:
     > *"¿En este momento querés ejecutar las pruebas con Docker / Supabase activo ahora, o preferís trabajar sin Docker (ejecutando los tests en modo Mock ahora y dejando las migraciones y tests de integración de Supabase preparados para correrlos cuando te conectes)?"*
   - **Modo A — Sin Docker ahora (`Mock Activo + Tests Supabase Preparados`)**:
     - Se ejecutan todas las pruebas unitarias, de UI y de contrato en `Vitest` usando `mockAdapter`.
     - Igualmente **se escriben y dejan listos** los archivos SQL (`workspace/supabase/migrations/`) y los archivos de test de integración de Supabase (marcados con condicional `describe.skipIf(!process.env.RUN_SUPABASE_TESTS)` y un script `npm run test:supabase`), de modo que cuando el usuario esté en una PC con Docker o conectado a Supabase pueda correrlos con un solo comando sin escribir nada extra.
   - **Modo B — Con Docker / Supabase activo ahora (`Ejecución Completa`)**:
     - Se ejecutan tanto la suite en modo Mock como las pruebas reales contra Supabase Local (Docker) o Supabase Staging (`pirro-dev`).
2. **Tests de Paridad de Contrato (`Contract Tests`)**:
   - Toda nueva feature que toque datos debe incluir pruebas en `Vitest` que verifiquen que tanto el `mockAdapter` como el `supabaseAdapter` respetan la misma estructura de entrada y salida (`usuarios`, `personas`, `perfil_alumno`, `rutinas`, `registros_rutina`).
3. **Trazabilidad**: Toda prueba automatizada debe estar vinculada a los identificadores de requisitos (`REQ-IDs`) definidos en `specs/`.

---

## V. Control de Cambios (Flujo SDD)

1. Toda funcionalidad nueva o cambio arquitectónico requiere especificación previa en `specs/` (`spec.md` -> `plan.md` -> `tasks.md`) y aprobación explícita del usuario (**Human Gate** + **Docker/Supabase Gate**) antes de que los Workers modifiquen el código en `workspace/`.
