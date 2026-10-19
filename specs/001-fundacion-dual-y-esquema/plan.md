# Plan Técnico y Propuesta Visual: 001 — Fundación Dual y Esquema Relacional Base

## 1. Dirección Estética y Crítica UI/UX (`frontend-design` + `shadcn`) — APROBADA

### 1.1 Sistema Dual de Paletas Confirmado: Turquesa, Gris, Plateado y Negro
A partir de la revisión visual con el usuario, se adopta la combinación de **Opción A (Turquesa Acero & Grafito)** como tema principal por defecto y **Opción C (Titanio Plateado & Turquesa Profundo)** como tema claro opcional alternable en 1 clic:

#### Tema Principal (Oscuro — *Turquesa Acero & Grafito*):
- **Fondo Principal (`--background`)**: `#111418` (*Negro Carbón Suave*).
- **Tarjetas y Paneles (`--card` / `--secondary`)**: `#1B2026` (*Gris Pizarra*) y `#252C34` (*Gris Acero*).
- **Bordes y Divisores (`--border`)**: `#323B46` (*Plateado Cepillado Oscuro*).
- **Acento Principal (`--primary`)**: `#00C2CB` (*Turquesa Intenso*) con estados hover/activos en `#5CE1E6` (*Turquesa Claro*) y texto oscuro `#0B0F12` para máximo contraste.
- **Texto Principal y Plateados (`--foreground` / `--muted-foreground`)**: `#FFFFFF` (*Blanco Puro*) para títulos/métricas y `#C4CDD5` (*Plateado Satinado*) para etiquetas y subtítulos.

#### Tema Alternativo (Claro — *Titanio Plateado & Turquesa Profundo*):
- **Fondo Principal (`--background`)**: `#E5E9EC` (*Gris Plata Claro*).
- **Tarjetas y Paneles (`--card` / `--secondary`)**: `#F4F6F8` (*Gris Perla*) con cabeceras de contraste en `#121619` (*Negro Carbón*).
- **Bordes y Divisores (`--border`)**: `#9EA8B3` (*Acero Plateado*).
- **Acento Principal (`--primary`)**: `#008B94` (*Turquesa Profundo*) y `#00ADB5` (*Turquesa Medio*).
- **Texto Principal (`--foreground` / `--muted-foreground`)**: `#121619` (*Negro Carbón*) y `#4A5562` (*Gris Plomo*).

### 1.2 Decisiones de Interfaz Confirmadas
1. **Barra `DevDataToolbar` Discreta y Colapsable**: Se ubicará como una píldora flotante mínima en la esquina inferior derecha (`fixed bottom-3 right-3`), visualmente poco intrusiva y colapsable para que al compilar en producción (`!import.meta.env.DEV`) su ausencia no afecte ningún layout ni flujo visual.
2. **Tablero Fundacional de Verificación en `App.jsx`**: Mostrará en vivo los datos iniciales cargados (cadena `usuarios -> personas -> perfil_alumno`, sedes de gimnasios con equipamiento, catálogo de ejercicios y rutinas semanales) junto con un laboratorio interactivo para probar en vivo el hook `useRoutineLocalStorage` (0 llamadas de red por serie) y el botón de guardado por lote (`guardarEntrenamientoBatch`).

---

## 2. Arquitectura Técnica y Estructura de Archivos

```text
Pirro-System/
├── specs/
│   └── 001-fundacion-dual-y-esquema/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── workspace/
│   ├── supabase/                                      # [REQ-FND-004..009]
│   │   ├── config.toml                                # Configuración declarativa de Supabase CLI
│   │   ├── migrations/
│   │   │   ├── 20261008000001_initial_schema.sql      # Tablas, PKs, FKs, CHECKs e Índices
│   │   │   └── 20261008000002_rls_and_rpc.sql         # Funciones de rol, Políticas RLS y RPC Batch
│   │   └── seed.sql                                   # Semilla SQL idéntica al Mock
│   │
│   └── frontend/                                      # [REQ-FND-001..003, 010..016]
│       ├── package.json                               # Scripts: dev, build, test, test:supabase
│       ├── vite.config.js                             # Vite 8 + React 19 + Tailwind v4 + alias @/ + Vitest
│       ├── components.json                            # Configuración oficial de shadcn/ui
│       ├── .env.example                               # Documentación de VITE_DATA_MODE y claves Supabase
│       ├── index.html
│       └── src/
│           ├── index.css                              # Tailwind v4 + tokens Turquesa Acero & Titanio Plateado
│           ├── main.jsx
│           ├── App.jsx
│           ├── lib/
│           │   └── utils.js                           # Helper cn() (clsx + tailwind-merge)
│           ├── components/
│           │   ├── ui/                                # Componentes shadcn/ui (button, card, badge, tabs, alert, separator)
│           │   └── dev/
│           │       └── DevDataToolbar.jsx             # [REQ-FND-014] Píldora discreta MOCK <-> SUPABASE + Reset
│           ├── services/
│           │   ├── supabaseClient.js                  # Inicialización segura y perezosa de @supabase/supabase-js
│           │   ├── dataProvider.js                    # [REQ-FND-010] getActiveDataMode, setDevDataMode, getProvider
│           │   ├── seed/
│           │   │   └── mockSeedData.js                # [REQ-FND-009] Semilla relacional espejo de seed.sql
│           │   ├── validators/
│           │   │   └── trainingBatchValidator.js      # [REQ-FND-012] Validación compartida por ambos adaptadores
│           │   └── adapters/
│           │       ├── mockAdapter.js                 # [REQ-FND-011] Persistencia en localStorage (pirro_mock_db_v1)
│           │       └── supabaseAdapter.js             # [REQ-FND-011] Consultas PostgREST + RPC guardar_entrenamiento_batch
│           ├── features/
│           │   ├── training/
│           │   │   └── hooks/
│           │   │       └── useRoutineLocalStorage.js  # [REQ-FND-013] Borrador Offline-First + commitBatch idempotente
│           │   └── foundation/
│           │       └── components/
│           │           ├── FoundationDashboard.jsx    # [REQ-FND-014] Tablero de verificación del esquema y datos
│           │           ├── RelationalEntityCard.jsx   # Visualización de usuarios -> personas -> perfil_alumno
│           │           └── BatchSyncSandbox.jsx       # Simulador interactivo de useRoutineLocalStorage + RPC Batch
│           └── tests/                                 # [REQ-FND-015, REQ-FND-016]
│               ├── setup.js
│               ├── dataProvider.test.js
│               ├── mockAdapter.test.js
│               ├── contractParity.test.js
│               ├── useRoutineLocalStorage.test.js
│               ├── FoundationDashboard.test.jsx
│               └── supabaseAdapter.supabase.test.js   # Con describe.skipIf(!process.env.RUN_SUPABASE_TESTS)
```

---

## 3. Trazabilidad de Componentes a Requisitos (`REQ-IDs`)

- **`workspace/supabase/migrations/20261008000001_initial_schema.sql`**: Implementa `REQ-FND-004` (`usuarios`, `personas`, `perfil_alumno`), `REQ-FND-005` (`gimnasios`, `equipamiento`, `gimnasio_equipamiento`, `ejercicios`) y `REQ-FND-006` (`rutinas`, `rutina_ejercicios`, `registros_rutina`, `detalle_series`) con índices en todas las claves foráneas.
- **`workspace/supabase/migrations/20261008000002_rls_and_rpc.sql`**: Implementa `REQ-FND-007` (RLS en las 10 tablas + `get_my_persona_id()` + `get_my_role()`) y `REQ-FND-008` (RPC `guardar_entrenamiento_batch(payload jsonb)`).
- **`workspace/supabase/seed.sql` & `src/services/seed/mockSeedData.js`**: Implementan `REQ-FND-009`.
- **`src/services/dataProvider.js` & `adapters/*`**: Implementan `REQ-FND-010`, `REQ-FND-011` y `REQ-FND-012`.
- **`src/features/training/hooks/useRoutineLocalStorage.js`**: Implementa `REQ-FND-013`.
- **`src/components/dev/DevDataToolbar.jsx` & `src/features/foundation/`**: Implementan `REQ-FND-003` y `REQ-FND-014`.
- **`src/tests/*.test.{js,jsx}` & `src/tests/*.supabase.test.js`**: Implementan `REQ-FND-015` y `REQ-FND-016`.
