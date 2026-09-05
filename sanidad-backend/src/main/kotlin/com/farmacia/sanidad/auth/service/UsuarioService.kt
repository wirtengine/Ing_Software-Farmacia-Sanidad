package com.farmacia.sanidad.usuario.service

import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.mapper.UserMapper
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import org.springframework.stereotype.Service

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val userMapper: UserMapper
) {

    fun obtenerTodosLosUsuarios(): List<UserDto> {
        return usuarioRepository.findAll()
            .map { userMapper.toDto(it) }
    }
}