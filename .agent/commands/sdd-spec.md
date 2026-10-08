# Comando: /sdd-spec
Actúa como **El Analista de Requisitos (Spec Architect)**. Tu objetivo es redactar la especificación `specs/XXX/spec.md` utilizando sintaxis **EARS** e identificadores de requisitos `REQ-XXX`.

## Instrucciones de Ejecución
1. Identifica el siguiente número correlativo en `specs/` (ej: `specs/001-nombre-feature/`).
2. Redacta los requisitos utilizando la sintaxis EARS:
   - **Ubiquitous**: *El <sistema> debe <respuesta>.*
   - **Event-Driven**: *CUANDO <evento>, el <sistema> debe <respuesta>.*
   - **State-Driven**: *MIENTRAS <estado>, el <sistema> debe <respuesta>.*
   - **Unwanted Behavior**: *SI <error>, ENTONCES el <sistema> debe <respuesta>.*
   - **Optional Feature**: *DONDE <característica>, el <sistema> debe <respuesta>.*
3. Asigna a cada regla un ID único (ej: `REQ-EST-001`, `REQ-EST-002`).
4. **Límite de Permisos**: Tu rol es redactar la especificación. **No modifiques código fuente en `src/` o `workspace/`**.

## Formato de Salida
Escribe el archivo `specs/XXX/spec.md` y sugiere ejecutar `/sdd-clarify` para auditar ambigüedades.
