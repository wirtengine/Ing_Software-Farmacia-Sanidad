# ADR-002: Arquitectura Modular por Dominio

## Contexto
El sistema debe ser mantenible y escalable, permitiendo la evolución independiente de cada funcionalidad. Se requiere una estructura que facilite la localización del código y la incorporación de nuevos módulos.

## Decisión
Se organiza el código en módulos por dominio funcional, cada uno con sus propias capas (controller, service, repository, entity, dto, mapper). Todos los módulos residen bajo com.farmacia.sanidad.

## Consecuencias
- Cada módulo es autocontenido, facilitando la asignación de tareas y la revisión de código.
- Las dependencias entre módulos deben ser explícitas a través de servicios y repositorios.
- Se evita la creación de paquetes gigantescos y se promueve la cohesión.

## Alternativas consideradas
- Arquitectura por capas tradicional (controller, service, repository globales) - genera dependencias cruzadas y mayor acoplamiento.
