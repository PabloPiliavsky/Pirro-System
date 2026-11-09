# Especificación de Requisitos: 004 — ABM de Alumnos y Ficha Física/Médica

## 1. Propósito y Alcance
Implementar la gestión integral de alumnos para el profesor y la consulta de ficha personal para el alumno:
1. **ABM Completo de Alumnos**: Creación, edición, consulta y baja/reactivación lógica (`estado = false / true`) de alumnos pertenecientes al profesor activo.
2. **Creación Encadenada Atómica sin Cierre de Sesión**: Alta simultánea de la cuenta en `usuarios`, identidad en `personas` (`rol = 'alumno'`) y ficha técnica en `perfil_alumno`, garantizando que la sesión activa del profesor permanezca intacta (sin suplantación de token JWT ni deslogueo).
3. **Ficha Física y Médica**: Registro y seguimiento de antecedentes clínicos (`salud_enfermedades`), biometría (`altura_cm`, `peso_kg`), fecha de ingreso, gimnasio/sede asignada (`id_gimnasio`, opcional), días semanales de entrenamiento (`cantidad_dias_rutina`) y observaciones pedagógicas (`comentario`).
4. **Contraseña Inicial y Acceso**: Soporte para contraseña inicial configurable con valor sugerido editable (`Pirro123!`), y bloqueo de login inmediato ante baja lógica (`estado = false`).
5. **Vista de Ficha del Alumno (`/alumno/perfil`)**: Consulta personal Mobile-First para que el alumno visualice sus datos, gimnasio y contacto de su profesor.
6. **Arquitectura y Proveedor Dual**: Paridad estricta entre `mockAdapter` (en `localStorage` con `pirro_mock_db_v1`) y `supabaseAdapter` (PostgreSQL / PostgREST con políticas RLS y función RPC transaccional `alta_alumno_profesor`).
7. **Modo de Entorno Confirmado (`Docker Gate`)**:
   - **Modo B — Con Docker / Supabase Activo Ahora**: Se validan tanto las pruebas en modo Mock como las pruebas de integración en vivo contra Supabase Local en Docker (`npm test` y `npm run test:supabase`).

---

## 2. Requisitos Funcionales y No Funcionales (Sintaxis EARS)

### A. Gestión Administrativa de Alumnos (`REQ-ALU-001` a `REQ-ALU-006`)

- **`REQ-ALU-001` (Ubiquitous — Consulta de Cartera de Alumnos)**:
  El sistema **debe** proveer el método `alumnosService.getAlumnos(filtros)` retornando la lista completa de alumnos asignados al `id_profesor` activo, integrando los datos de `personas`, `usuarios` (nombre de usuario, email, estado), `perfil_alumno` (biometría, salud, días de rutina) y el nombre de la sede asignada (`gimnasio.nombre`, o etiqueta "Sin sede asignada" si es nulo).

- **`REQ-ALU-002` (Event-Driven — Alta Encadenada de Alumno sin Pérdida de Sesión)**:
  **CUANDO** el profesor envíe el formulario de alta con `{ nombre, apellido, email, nombre_usuario, password, telefono, fecha_nacimiento, id_gimnasio, altura_cm, peso_kg, salud_enfermedades, fecha_ingreso, cantidad_dias_rutina, comentario }`, el sistema **debe** persistir de manera atómica las filas en `usuarios`, `personas` (`rol = 'alumno'`) y `perfil_alumno` (`id_profesor = profesor.id`), manteniendo inalterada la sesión autenticada del profesor. Si no se especifica contraseña, se utilizará `'Pirro123!'` como valor por defecto.

- **`REQ-ALU-003` (Event-Driven — Edición de Alumno y Ficha Médica)**:
  **CUANDO** el profesor modifique los datos personales, de acceso o médicos de un alumno existente, el sistema **debe** actualizar selectivamente las tablas correspondientes en una sola operación coherente, validando que el alumno pertenezca a la cartera del profesor autenticado.

- **`REQ-ALU-004` (Unwanted Behavior — Validación Defensiva de Datos de Alumno)**:
  **SI** el formulario de alta carece de `nombre`, `apellido`, `nombre_usuario`, `email` válido o si `cantidad_dias_rutina` se encuentra fuera del rango 1 a 7, **ENTONCES** el sistema **debe** rechazar la operación con el error `INVALID_ALUMNO_DATA` detallando los campos observados. La selección de `id_gimnasio` es opcional y puede quedar en `null`.

- **`REQ-ALU-005` (Unwanted Behavior — Control de Duplicados en Credenciales)**:
  **SI** se intenta registrar un alumno cuyo `email` o `nombre_usuario` ya exista en el sistema, **ENTONCES** el sistema **debe** devolver el error `DUPLICATE_USER_CREDENTIALS` sin alterar ninguna tabla y alertando al usuario en la interfaz.

- **`REQ-ALU-006` (Event-Driven — Baja Lógica, Reactivación y Bloqueo de Acceso)**:
  **CUANDO** el profesor alterne el estado de un alumno (dar de baja o reactivar), el sistema **debe** actualizar el flag `estado` en `personas` y `usuarios` (`estado = false / true`), preservando íntegramente las rutinas creadas, planillas y series históricas completadas por el alumno. **SI** un alumno inactivo intenta iniciar sesión, el sistema **debe** denegar el acceso mostrando el mensaje de error de cuenta inhabilitada.

---

### B. Interfaz de Usuario y Ficha Médica (`REQ-ALU-007` a `REQ-ALU-009`)

- **`REQ-ALU-007` (Ubiquitous — Panel de Gestión de Alumnos del Profesor)**:
  La vista `/profesor/alumnos` **debe** presentar:
  1. Barra superior con buscador en tiempo real (por nombre, apellido, usuario o email), selector de filtro por gimnasio/sede, filtro por estado (Activos / Inactivos / Todos) y botón de acción principal "Nuevo Alumno".
  2. Grilla de tarjetas interactivas de alumnos con foto/avatar, datos de contacto rápido (teléfono con enlace directo a WhatsApp, email), días semanales asignados y badge de estado operativo.
  3. Acceso en un clic al modal de Ficha Médica/Física y al formulario de edición rápida.

- **`REQ-ALU-008` (Ubiquitous — Modal de Ficha Física y Médica Detallada)**:
  El sistema **debe** proveer un diálogo modal accesible que exhiba de manera estructurada:
  1. Antecedentes clínicos y patologías registradas (`salud_enfermedades`), resaltadas con badge de advertencia visual si contiene texto médico relevante.
  2. Datos antropométricos (`altura_cm`, `peso_kg`, cálculo automático de IMC informativo) y fecha de ingreso al entrenamiento.
  3. Sede habitual de entrenamiento y notas pedagógicas (`comentario`).

- **`REQ-ALU-009` (Ubiquitous — Vista de Ficha Personal del Alumno)**:
  La vista `/alumno/perfil` **debe** proveer una experiencia Mobile-First con botones táctiles grandes ($\ge 44\text{px}$), donde el alumno consulta su ficha médica, gimnasio asignado con dirección/horarios, días de rutina semanales y datos de contacto de su profesor.

---

### C. Proveedor Dual, Seguridad y Pruebas (`REQ-ALU-010` a `REQ-ALU-012`)

- **`REQ-ALU-010` (Ubiquitous — Paridad Estricta en Métodos de Servicio)**:
  Tanto `mockAdapter` como `supabaseAdapter` **deben** implementar con idénticas firmas y respuestas:
  - `getAlumnos(filtros)`
  - `getAlumnoById(idPersona)`
  - `crearAlumno(alumnoData)`
  - `actualizarAlumno(idPersona, alumnoData)`
  - `cambiarEstadoAlumno(idPersona, nuevoEstado)`
  - `getMiPerfilAlumno()`
  garantizando cero acoplamiento directo a Supabase o localStorage en las vistas de React.

- **`REQ-ALU-011` (Ubiquitous — Función RPC Transaccional `alta_alumno_profesor`)**:
  En el backend de Supabase (`workspace/supabase/migrations/`), se **debe** disponer de una función SQL `SECURITY DEFINER` que inserte de forma atómica en `usuarios`, `personas` y `perfil_alumno`, verificando que el invocador sea un usuario activo con rol `'profesor'`, sin afectar su token de sesión.

- **`REQ-ALU-012` (Ubiquitous — Cobertura y Regla de Clean Code)**:
  Todo componente y hook **debe** respetar el límite orientativo de $\sim 40$ líneas por función y $\sim 100$ líneas por archivo, sin punto y coma (`;`), y contar con pruebas unitarias (`alumnosService.test.js`) y de integración (`alumnosService.supabase.test.js`) que validen las operaciones CRUD y validaciones defensivas.
