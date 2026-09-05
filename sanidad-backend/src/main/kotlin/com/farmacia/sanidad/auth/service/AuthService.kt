package com.farmacia.sanidad.auth.service

import com.farmacia.sanidad.auth.dto.AuthResponse
import com.farmacia.sanidad.auth.dto.LoginRequest
import com.farmacia.sanidad.auth.dto.RegisterRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.mapper.UserMapper
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.auth.security.JwtUtil
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val usuarioRepository: UsuarioRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil,
    private val authenticationManager: AuthenticationManager,
    private val userMapper: UserMapper
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (usuarioRepository.existsByUsername(request.username)) {
            throw IllegalArgumentException("El nombre de usuario ya existe")
        }

        val usuario = Usuario(
            username = request.username,
            nombreCompleto = request.nombreCompleto,
            passwordHash = passwordEncoder.encode(request.password),
            rol = request.rol
        )

        usuarioRepository.save(usuario)

        val token = jwtUtil.generateToken(usuario.username, usuario.rol.name)
        return AuthResponse(
            token = token,
            username = usuario.username,
            rol = usuario.rol.name
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )

        val usuario = usuarioRepository.findByUsername(request.username)
            .orElseThrow { IllegalArgumentException("Usuario no encontrado") }

        val token = jwtUtil.generateToken(usuario.username, usuario.rol.name)
        return AuthResponse(
            token = token,
            username = usuario.username,
            rol = usuario.rol.name
        )
    }

    fun getCurrentUser(username: String): UserDto {
        val usuario = usuarioRepository.findByUsername(username)
            .orElseThrow { IllegalArgumentException("Usuario no encontrado") }
        return userMapper.toDto(usuario)
    }
}