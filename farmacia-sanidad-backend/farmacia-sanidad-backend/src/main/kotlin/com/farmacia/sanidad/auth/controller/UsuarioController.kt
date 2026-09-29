package com.farmacia.sanidad.auth.controller

import com.farmacia.sanidad.auth.dto.CambiarPasswordRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.dto.toDto
import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.service.UsuarioService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios")
class UsuarioController(private val usuarioService: UsuarioService) {

    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    fun listarTodos(): List<UserDto> = usuarioService.listarTodos()

    @GetMapping("/activos") @PreAuthorize("hasRole('ADMIN')")
    fun listarActivos(): List<UserDto> = usuarioService.listarActivos()

    @GetMapping("/perfil") @Operation(summary = "Perfil del usuario autenticado")
    fun perfil(@AuthenticationPrincipal usuario: Usuario): UserDto = usuario.toDto()

    @GetMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    fun obtener(@PathVariable id: UUID): UserDto = usuarioService.obtenerPorId(id)

    @PatchMapping("/{id}/desactivar") @PreAuthorize("hasRole('ADMIN')")
    fun desactivar(@PathVariable id: UUID, @AuthenticationPrincipal actual: Usuario): UserDto =
        usuarioService.desactivar(id, actual)

    @PatchMapping("/{id}/activar") @PreAuthorize("hasRole('ADMIN')")
    fun activar(@PathVariable id: UUID): UserDto = usuarioService.activar(id)

    @PatchMapping("/{id}/password")
    fun cambiarPassword(
        @PathVariable id: UUID,
        @Valid @RequestBody request: CambiarPasswordRequest,
        @AuthenticationPrincipal actual: Usuario
    ): ResponseEntity<UserDto> = ResponseEntity.ok(usuarioService.cambiarPassword(id, request, actual))
}
