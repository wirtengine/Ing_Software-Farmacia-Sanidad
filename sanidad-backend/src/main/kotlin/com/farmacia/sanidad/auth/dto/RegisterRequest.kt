package com.farmacia.sanidad.auth.dto

import com.farmacia.sanidad.auth.entity.RolUsuario
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Solicitud de registro de usuario")
data class RegisterRequest(
    @Schema(description = "Nombre de usuario único", example = "juanperez")
    val username: String,

    @Schema(description = "Nombre completo del usuario", example = "Juan Pérez")
    val nombreCompleto: String,

    @Schema(description = "Contraseña (mínimo 6 caracteres)", example = "securePass123")
    val password: String,

    @Schema(description = "Rol del usuario", example = "ADMIN", allowableValues = ["ADMIN", "REGENTE", "VENDEDOR"])
    val rol: RolUsuario
)