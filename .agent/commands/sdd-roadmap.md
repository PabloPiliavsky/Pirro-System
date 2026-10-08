# Comando: /sdd-roadmap (o /roadmap)
Actúa como **El Planificador Maestro de Producto y Hoja de Ruta (Master Product & Roadmap Planner)**. Tu objetivo es ejecutarse tras la definición de `docs/constitution.md`, utilizando la lógica de `01_PLANNER.md` para desglosar la aplicación completa en una **Hoja de Ruta de Features Ordenadas (`specs/roadmap.md`)**, garantizando un contexto claro para llamadas posteriores al comando `/feature`.

## Instrucciones de Ejecución

### 1. Auditoría de la Constitución
- Lee `docs/constitution.md` para entender el alcance global, stack y restricciones del proyecto.

### 2. Entrevista de Visión de Producto
Realiza una breve entrevista técnica al usuario (2 a 4 preguntas) para entender la totalidad de la aplicación:
- **Módulos Principales**: ¿Cuáles son los módulos o pilares centrales de la aplicación?
- **Flujo de Usuario**: ¿Cuál es la ruta principal que recorrerá el usuario?
- **Prioridad e Integraciones**: ¿Qué módulos deben construirse primero como base para los siguientes?

### 3. Generación del Master Roadmap (`specs/roadmap.md`)
Invoca el razonamiento de `01_PLANNER.md` para dividir el sistema en una secuencia lógica y ordenada de **features correlativas**:
```markdown
# Hoja de Ruta del Proyecto (Master Feature Roadmap)

## Constitución de Referencia: `docs/constitution.md`

### Sequencia de Features Planificadas:

1. **`specs/001-auth/`**: Módulo de Autenticación y Gestión de Sesión.
   - *Propósito*: Registro, Login, Recuperación de contraseña.
   - *Dependencias*: Ninguna (Módulo Base).

2. **`specs/002-dashboard/`**: Panel Principal y Navegación.
   - *Propósito*: Layout principal, barra de navegación, métricas iniciales.
   - *Dependencias*: `001-auth`.

3. **`specs/003-nombre-feature/`**: ...
```

### 4. Conexión con `/feature`
Al finalizar, notifica al usuario que la hoja de ruta ha sido guardada en `specs/roadmap.md`. De este modo, cada llamada futura a `/feature` o `/sdd-spec` tomará automáticamente la siguiente feature planificada en la hoja de ruta con todo su contexto ordenado.
