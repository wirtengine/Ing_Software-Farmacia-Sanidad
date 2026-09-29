package com.farmacia.sanidad.auth.service

import com.farmacia.sanidad.auth.dto.CambiarPasswordRequest
import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.dto.toDto
import com.farmacia.sanidad.auth.entity.RolUsuario
import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.ValidacionException
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val passwordEncoder: PasswordEncoder
) {
    @Transactional(readOnly = true)
    fun listarTodos(): List<UserDto> = usuarioRepository.findAll().sortedBy { it.nombreCompleto }.map { it.toDto() }

    @Transactional(readOnly = true)
    fun listarActivos(): List<UserDto> = usuarioRepository.findByActivoTrue().map { it.toDto() }

    @Transactional(readOnly = true)
    fun obtenerPorId(id: UUID): UserDto = buscar(id).toDto()

    fun desactivar(id: UUID, actual: Usuario): UserDto {
        if (id == actual.id) throw ValidacionException("No podés desactivar tu propio usuario")
        return buscar(id).apply { activo = false }.let { usuarioRepository.save(it).toDto() }
    }

    fun activar(id: UUID): UserDto = buscar(id).apply { activo = true }.let { usuarioRepository.save(it).toDto() }

    fun cambiarPassword(id: UUID, request: CambiarPasswordRequest, actual: Usuario): UserDto {
        if (id != actual.id && actual.rol != RolUsuario.ADMIN) {
            throw AccessDeniedException("Solo podés cambiar tu propia contraseña")
        }
        val usuario = buscar(id)
        if (id == actual.id && !passwordEncoder.matches(request.passwordActual, usuario.passwordHash)) {
            throw ValidacionException("La contraseña actual es incorrecta")
        }
        usuario.passwordHash = passwordEncoder.encode(request.passwordNueva)
        return usuarioRepository.save(usuario).toDto()
    }

    private fun buscar(id: UUID) = usuarioRepository.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Usuario no encontrado con id: $id") }
}
