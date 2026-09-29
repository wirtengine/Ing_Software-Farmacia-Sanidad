package com.farmacia.sanidad.estante

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "estantes", schema = "farmacia")
class Estante {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(name = "codigo", nullable = false, unique = true, length = 30)
    var codigo: String = ""

    @Column(name = "descripcion")
    var descripcion: String? = null

    @Column(name = "ubicacion_fisica")
    var ubicacionFisica: String? = null

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
}

interface EstanteRepository : JpaRepository<Estante, UUID> {
    fun existsByCodigo(codigo: String): Boolean
    fun findByActivoTrueOrderByCodigo(): List<Estante>
    fun findAllByOrderByCodigo(): List<Estante>
}

data class EstanteRequest(
    @field:NotBlank(message = "El código del estante es obligatorio")
    @field:Size(max = 30) val codigo: String = "",
    @field:Size(max = 255) val descripcion: String? = null,
    @field:Size(max = 255) val ubicacionFisica: String? = null
)

data class EstanteResponse(
    val id: UUID,
    val codigo: String,
    val descripcion: String?,
    val ubicacionFisica: String?,
    val activo: Boolean,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)

fun Estante.toResponse() = EstanteResponse(id!!, codigo, descripcion, ubicacionFisica, activo, createdAt, updatedAt)
