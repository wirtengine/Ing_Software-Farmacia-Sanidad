package com.farmacia.sanidad.auth.controller

import com.farmacia.sanidad.auth.dto.AuthResponse
import com.farmacia.sanidad.auth.dto.LoginRequest
import com.farmacia.sanidad.auth.dto.RegisterRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.login(request))

    @PostMapping("/register")
    @Operation(summary = "Registrar usuario (libre solo si no hay usuarios; luego requiere ADMIN)")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<UserDto> =
        ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request))
}
