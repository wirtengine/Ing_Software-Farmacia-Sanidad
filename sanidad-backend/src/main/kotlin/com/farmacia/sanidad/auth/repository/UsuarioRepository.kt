package com.farmacia.sanidad.auth.repository

import com.farmacia.sanidad.auth.entity.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface UsuarioRepository : JpaRepository<Usuario, UUID> {
    fun findByUsername(username: String): Optional<Usuario>
    fun existsByUsername(username: String): Boolean
}