# ADR-005: Auditoría Transversal

## Contexto
El documento de requisitos exige trazabilidad de operaciones críticas (creación, modificación, eliminación, anulaciones, etc.) con fecha, usuario y acción.

## Decisión
Se implementa un trigger genérico en PostgreSQL (n_auditar) que registra en la tabla uditoria los cambios en las tablas principales. Cada operación pasa por el trigger, y Spring Boot establece el contexto del usuario mediante SET LOCAL app.current_user_id.

## Consecuencias
- Auditoría automática sin modificar el código de la aplicación.
- El historial queda almacenado en la base de datos, accesible para reportes.
- Requiere que cada petición establezca el usuario actual en la sesión de la base de datos.

## Alternativas consideradas
- Auditoría en el código Kotlin mediante Aspect-Oriented Programming (AOP) - más acoplamiento y riesgo de omisión.
