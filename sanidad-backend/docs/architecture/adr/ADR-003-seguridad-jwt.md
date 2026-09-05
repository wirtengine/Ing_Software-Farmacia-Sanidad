# ADR-003: Seguridad con JWT

## Contexto
El sistema requiere autenticación y autorización basada en roles (ADMIN, REGENTE, VENDEDOR). Se necesita un mecanismo stateless y seguro para manejar sesiones de usuario, especialmente porque el frontend será una SPA (React).

## Decisión
Se utiliza JWT (JSON Web Tokens) con Spring Security. Los tokens son firmados con una clave secreta y tienen una expiración configurable. El filtro JWT valida cada petición protegida.

## Consecuencias
- No se mantiene estado en el servidor, facilitando la escalabilidad horizontal.
- Los tokens deben ser gestionados por el frontend (almacenados en localStorage o cookies HttpOnly).
- La invalidación de tokens requiere una estrategia adicional (por ejemplo, lista negra) que no se implementa en esta fase.

## Alternativas consideradas
- Sesiones basadas en cookies (requieren estado en servidor, menos escalable).
- OAuth2 (más complejo, no necesario para este alcance).
