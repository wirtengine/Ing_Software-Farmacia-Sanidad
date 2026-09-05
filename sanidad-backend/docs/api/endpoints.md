# Endpoints de la API

## Autenticación

### POST /api/auth/register
Registra un nuevo usuario.

**Request:**
\\\json
{
  "username": "admin",
  "nombreCompleto": "Administrador",
  "password": "admin123",
  "rol": "ADMIN"
}
\\\

**Response (201):**
\\\json
{
  "token": "eyJhbGc...",
  "username": "admin",
  "rol": "ADMIN"
}
\\\

### POST /api/auth/login
Inicia sesión y devuelve token JWT.

**Request:**
\\\json
{
  "username": "admin",
  "password": "admin123"
}
\\\

**Response (200):**
\\\json
{
  "token": "eyJhbGc...",
  "username": "admin",
  "rol": "ADMIN"
}
\\\

### GET /api/auth/me
Obtiene perfil del usuario autenticado. (Requiere token)

**Header:** \Authorization: Bearer <token>\

**Response (200):**
\\\json
{
  "id": "uuid",
  "username": "admin",
  "nombreCompleto": "Administrador",
  "rol": "ADMIN",
  "activo": true
}
\\\

## (Los demás endpoints se documentarán a medida que se desarrollen)
