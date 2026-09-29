package com.farmacia.sanidad.auth.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime
import java.util.UUID

enum class RolUsuario { ADMIN, REGENTE, VENDEDOR }

@Entity
@Table(name = "usuarios", schema = "farmacia")
class Usuario : UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    // Se llama "nombreUsuario" (no "username") para no chocar con getUsername() de UserDetails.
    @Column(name = "username", nullable = false, unique = true)
    var nombreUsuario: String = ""

    @Column(name = "nombre_completo", nullable = false)
    var nombreCompleto: String = ""

    @Column(name = "password_hash", nullable = false)
    var passwordHash: String = ""

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    var rol: RolUsuario = RolUsuario.VENDEDOR

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true

    @Column(name = "ultimo_acceso")
    var ultimoAcceso: LocalDateTime? = null

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null

    override fun getAuthorities(): Collection<GrantedAuthority> = listOf(SimpleGrantedAuthority("ROLE_${rol.name}"))
    override fun getPassword(): String = passwordHash
    override fun getUsername(): String = nombreUsuario
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = activo
}
