package com.farmacia.sanidad.auth.repository

import com.farmacia.sanidad.auth.entity.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UsuarioRepository : JpaRepository<Usuario, UUID> {
    fun findByNombreUsuario(nombreUsuario: String): Usuario?
    fun existsByNombreUsuario(nombreUsuario: String): Boolean
    fun findByActivoTrue(): List<Usuario>
}
