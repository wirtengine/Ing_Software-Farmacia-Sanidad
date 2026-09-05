package com.farmacia.sanidad.auth.entity

import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "usuarios", schema = "farmacia")
class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(name = "username", length = 80, nullable = false, unique = true)
    var username: String,

    @Column(name = "nombre_completo", length = 160, nullable = false)
    var nombreCompleto: String,

    @Column(name = "password_hash", nullable = false)
    var passwordHash: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    var rol: RolUsuario,

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true,

    @Column(name = "ultimo_acceso")
    var ultimoAcceso: OffsetDateTime? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now()
)