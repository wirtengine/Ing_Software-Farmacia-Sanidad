package com.farmacia.sanidad.auth.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Respuesta de autenticación con token JWT")
data class AuthResponse(
    @Schema(description = "Token JWT para autenticación", example = "eyJhbGciOiJIUzI1NiIs...")
    val token: String,

    @Schema(description = "Nombre de usuario autenticado", example = "admin")
    val username: String,

    @Schema(description = "Rol del usuario", example = "ADMIN")
    val rol: String
)