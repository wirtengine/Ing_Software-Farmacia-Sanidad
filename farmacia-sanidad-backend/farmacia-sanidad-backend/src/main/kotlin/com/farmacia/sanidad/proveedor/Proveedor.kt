package com.farmacia.sanidad.proveedor

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "proveedores", schema = "farmacia")
class Proveedor {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(name = "ruc", nullable = false, unique = true)
    var ruc: String = ""

    @Column(name = "razon_social", nullable = false)
    var razonSocial: String = ""

    @Column(name = "telefono")
    var telefono: String? = null

    @Column(name = "correo_electronico")
    var correoElectronico: String? = null

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
}

interface ProveedorRepository : JpaRepository<Proveedor, UUID> {
    fun existsByRuc(ruc: String): Boolean
    fun findAllByOrderByRazonSocial(): List<Proveedor>
    fun findByActivoTrueOrderByRazonSocial(): List<Proveedor>
}

data class ProveedorRequest(
    @field:NotBlank(message = "El RUC es obligatorio") @field:Size(max = 30) val ruc: String = "",
    @field:NotBlank(message = "La razón social es obligatoria") @field:Size(max = 180) val razonSocial: String = "",
    @field:Size(max = 30) val telefono: String? = null,
    @field:Email(message = "Correo inválido") @field:Size(max = 160) val correoElectronico: String? = null
)

data class ProveedorResponse(
    val id: UUID, val ruc: String, val razonSocial: String, val telefono: String?,
    val correoElectronico: String?, val activo: Boolean, val createdAt: LocalDateTime?, val updatedAt: LocalDateTime?
)

fun Proveedor.toResponse() = ProveedorResponse(id!!, ruc, razonSocial, telefono, correoElectronico, activo, createdAt, updatedAt)
