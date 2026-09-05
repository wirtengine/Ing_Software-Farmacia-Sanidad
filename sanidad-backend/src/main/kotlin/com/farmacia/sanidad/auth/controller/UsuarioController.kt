package com.farmacia.sanidad.usuario.controller

import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.usuario.service.UsuarioService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/usuarios")
class UsuarioController(
    private val usuarioService: UsuarioService
) {

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    fun listarUsuarios(): List<UserDto> {
        return usuarioService.obtenerTodosLosUsuarios()
    }
}