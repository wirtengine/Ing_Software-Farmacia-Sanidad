package com.farmacia.sanidad.auth.dto

import com.farmacia.sanidad.auth.entity.RolUsuario
import com.farmacia.sanidad.auth.entity.Usuario
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime
import java.util.UUID

data class LoginRequest(
    @field:NotBlank(message = "El usuario es obligatorio") val username: String = "",
    @field:NotBlank(message = "La contraseña es obligatoria") val password: String = ""
)

data class RegisterRequest(
    @field:NotBlank @field:Size(min = 4, max = 80) val username: String = "",
    @field:NotBlank @field:Size(max = 160) val nombreCompleto: String = "",
    @field:NotBlank @field:Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") val password: String = "",
    @field:NotNull val rol: RolUsuario? = null
)

data class CambiarPasswordRequest(
    @field:NotBlank val passwordActual: String = "",
    @field:NotBlank @field:Size(min = 6) val passwordNueva: String = ""
)

data class UserDto(
    val id: UUID,
    val username: String,
    val nombreCompleto: String,
    val rol: RolUsuario,
    val activo: Boolean,
    val ultimoAcceso: LocalDateTime?,
    val createdAt: LocalDateTime?
)

data class AuthResponse(
    val token: String,
    val tipo: String = "Bearer",
    val expiraEn: Long,
    val usuario: UserDto
)

fun Usuario.toDto() = UserDto(
    id = id!!, username = nombreUsuario, nombreCompleto = nombreCompleto,
    rol = rol, activo = activo, ultimoAcceso = ultimoAcceso, createdAt = createdAt
)
