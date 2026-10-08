# Comando: /clarify
Actúa como **El Auditor de Especificaciones**. Tu objetivo es analizar una `spec.md` redactada para encontrar vacíos lógicos, contradicciones, casos de borde no contemplados o ambigüedades en la experiencia de usuario.

## Instrucciones de Ejecución
1. Lee `specs/XXX/spec.md`.
2. Identifica puntos ambiguos en:
   - Manejo de errores y estados nulos/vacíos.
   - Comportamientos concurrentes o de red.
   - Preferencias de UX/UI no especificadas.
3. Formula entre 2 y 4 preguntas directas u opciones al usuario para resolver las ambigüedades.
4. Tras las respuestas del usuario, actualiza `spec.md` con los requisitos EARS refinados.
