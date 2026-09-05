# ADR-001: Stack Tecnológico

## Contexto
El proyecto requiere un backend robusto, escalable y con soporte para desarrollo ágil. Se necesita una plataforma que permita implementar rápidamente los casos de uso definidos en la especificación, con énfasis en seguridad, integridad de datos y facilidad de mantenimiento.

## Decisión
Se adopta el siguiente stack:
- **Lenguaje**: Kotlin (versión 1.9.24) por su concisión, interoperabilidad con Java y características modernas.
- **Framework**: Spring Boot (3.3.4) por su ecosistema completo (Spring Security, Data JPA, MVC).
- **Base de datos**: PostgreSQL (mediante Supabase) por su robustez y soporte nativo para enums, transacciones y funciones PL/pgSQL.
- **Migraciones**: Flyway para versionamiento del esquema.
- **Mapeo**: MapStruct para mapeo automático de entidades a DTOs.
- **Seguridad**: JWT con Spring Security, stateless.
- **Documentación API**: OpenAPI 3 + Swagger UI.

## Consecuencias
- Mayor curva de aprendizaje inicial, pero mayor productividad a largo plazo.
- El uso de Kotlin facilita la escritura de código más seguro y conciso.
- La integración con Supabase proporciona una base de datos gestionada con características avanzadas (funciones, triggers, vistas).

## Alternativas consideradas
- Java puro (más verboso, menos features modernas)
- Node.js/Express (menos robusto para transacciones complejas)
- Django (Python, menos performance en operaciones concurrentes)
