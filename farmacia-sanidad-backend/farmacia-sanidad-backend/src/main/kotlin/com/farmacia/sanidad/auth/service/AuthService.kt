package com.farmacia.sanidad.auth.service

import com.farmacia.sanidad.auth.dto.AuthResponse
import com.farmacia.sanidad.auth.dto.LoginRequest
import com.farmacia.sanidad.auth.dto.RegisterRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.dto.toDto
import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.auth.security.JwtUtil
import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import org.slf4j.LoggerFactory
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class AuthService(
    private val usuarioRepository: UsuarioRepository,
    private val authenticationManager: AuthenticationManager,
    private val jwtUtil: JwtUtil,
    private val passwordEncoder: PasswordEncoder
) {
    private val log = LoggerFactory.getLogger(AuthService::class.java)

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(UsernamePasswordAuthenticationToken(request.username.trim(), request.password))
        val usuario = usuarioRepository.findByNombreUsuario(request.username.trim())
            ?: throw BadCredentialsException("Credenciales inválidas")
        usuario.ultimoAcceso = LocalDateTime.now()
        usuarioRepository.save(usuario)
        log.info("Inicio de sesión: {}", usuario.nombreUsuario)
        return AuthResponse(token = jwtUtil.generarToken(usuario), expiraEn = jwtUtil.expiration, usuario = usuario.toDto())
    }

    /**
     * Si no existe ningún usuario, el registro es libre (para crear el primer ADMIN).
     * Después, solo un ADMIN autenticado puede registrar usuarios.
     */
    fun register(request: RegisterRequest): UserDto {
        if (usuarioRepository.count() > 0) {
            val auth = SecurityContextHolder.getContext().authentication
            val esAdmin = auth?.authorities?.any { it.authority == "ROLE_ADMIN" } == true
            if (!esAdmin) throw AccessDeniedException("Solo un administrador puede registrar usuarios")
        }
        val username = request.username.trim()
        if (usuarioRepository.existsByNombreUsuario(username)) {
            throw CodigoDuplicadoException("El usuario '$username' ya está en uso")
        }
        val usuario = Usuario().apply {
            nombreUsuario = username
            nombreCompleto = request.nombreCompleto.trim()
            passwordHash = passwordEncoder.encode(request.password)
            rol = request.rol!!
            activo = true
        }
        val guardado = usuarioRepository.save(usuario)
        log.info("Usuario registrado: {} ({})", guardado.nombreUsuario, guardado.rol)
        return guardado.toDto()
    }
}
