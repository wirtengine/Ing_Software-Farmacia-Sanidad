package com.farmacia.sanidad.auth.security

import com.farmacia.sanidad.auth.repository.UsuarioRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Implementación de [UserDetailsService] que carga un usuario desde la base de datos
 * utilizando el repositorio de usuarios.
 */
@Service
class CustomUserDetailsService(
    private val usuarioRepository: UsuarioRepository
) : UserDetailsService {

    /**
     * Carga los detalles del usuario por nombre de usuario.
     * Lanza [UsernameNotFoundException] si no existe o está inactivo.
     *
     * @param username nombre de usuario
     * @return [UserDetails] con el nombre, contraseña y roles
     * @throws UsernameNotFoundException si el usuario no existe o está inactivo
     */
    override fun loadUserByUsername(username: String): UserDetails {
        val usuario = usuarioRepository.findByUsername(username)
            .orElseThrow { UsernameNotFoundException("Usuario no encontrado: $username") }

        if (!usuario.activo) {
            throw UsernameNotFoundException("Usuario inactivo: $username")
        }

        return User.builder()
            .username(usuario.username)
            .password(usuario.passwordHash)
            .roles(usuario.rol.name)
            .build()
    }
}