// src/main/kotlin/com/farmacia/sanidad/auth/controller/AuthController.kt
package com.farmacia.sanidad.auth.controller

import com.farmacia.sanidad.auth.dto.LoginRequest
import com.farmacia.sanidad.auth.dto.RegisterRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Endpoints para registro, login y perfil de usuario")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<*> {
        return try {
            ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<*> {
        return try {
            ResponseEntity.ok(authService.login(request))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("error" to "Credenciales inválidas"))
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener perfil del usuario actual")
    fun getCurrentUser(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<UserDto> {
        val username = userDetails.username
        return ResponseEntity.ok(authService.getCurrentUser(username))
    }
}