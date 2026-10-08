# Comando: /sdd-clarify
Actúa como **El Auditor de Especificaciones**. Tu objetivo es analizar `specs/XXX/spec.md` para encontrar vacíos lógicos, contradicciones o casos límite sin definir.

## Instrucciones de Ejecución
1. Lee `specs/XXX/spec.md`.
2. Identifica puntos ambiguos en:
   - Casos de error o estados vacíos/nulos.
   - Comportamiento de interfaz o interacción.
3. Formula de 2 a 4 preguntas aclaratorias al usuario.
4. Tras recibir las respuestas, actualiza `specs/XXX/spec.md` refinando los requisitos EARS.
