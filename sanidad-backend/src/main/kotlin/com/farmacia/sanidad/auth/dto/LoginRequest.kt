package com.farmacia.sanidad.auth.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solicitud de inicio de sesión")
data class LoginRequest(
    @Schema(description = "Nombre de usuario", example = "admin")
    val username: String,

    @Schema(description = "Contraseña", example = "admin123")
    val password: String
)