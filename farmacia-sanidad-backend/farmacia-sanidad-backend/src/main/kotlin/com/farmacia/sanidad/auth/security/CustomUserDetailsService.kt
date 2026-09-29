package com.farmacia.sanidad.auth.security

import com.farmacia.sanidad.auth.repository.UsuarioRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(private val usuarioRepository: UsuarioRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails =
        usuarioRepository.findByNombreUsuario(username)
            ?: throw UsernameNotFoundException("Usuario no encontrado")
}
