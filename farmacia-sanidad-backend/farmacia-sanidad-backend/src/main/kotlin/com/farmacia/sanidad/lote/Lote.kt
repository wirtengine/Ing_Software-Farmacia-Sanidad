package com.farmacia.sanidad.lote

import com.farmacia.sanidad.producto.Producto
import com.farmacia.sanidad.proveedor.Proveedor
import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

enum class EstadoLote { DISPONIBLE, VENCIDO, CUARENTENA, EN_TRANSITO_PROVEEDOR, AGOTADO }

@Entity
@Table(name = "lotes", schema = "farmacia")
class Lote {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    var producto: Producto? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id")
    var proveedor: Proveedor? = null

    @Column(name = "numero_lote", nullable = false)
    var numeroLote: String = ""

    @Column(name = "fecha_fabricacion")
    var fechaFabricacion: LocalDate? = null

    @Column(name = "fecha_vencimiento")
    var fechaVencimiento: LocalDate? = null

    @Column(name = "cantidad_inicial", nullable = false)
    var cantidadInicial: Int = 0

    @Column(name = "cantidad_disponible", nullable = false)
    var cantidadDisponible: Int = 0

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    var estado: EstadoLote = EstadoLote.DISPONIBLE

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
}

interface LoteRepository : JpaRepository<Lote, UUID> {
    @Query("select l from Lote l order by l.createdAt desc")
    fun listarRecientes(): List<Lote>

    @Query("select l from Lote l where l.producto.id = :productoId order by l.fechaVencimiento asc nulls last")
    fun porProducto(@Param("productoId") productoId: UUID): List<Lote>

    @Query(
        """
        select l from Lote l
        where l.estado = com.farmacia.sanidad.lote.EstadoLote.DISPONIBLE and l.cantidadDisponible > 0
          and l.fechaVencimiento is not null and l.fechaVencimiento <= :limite
        order by l.fechaVencimiento asc
        """
    )
    fun proximosAVencer(@Param("limite") limite: LocalDate): List<Lote>

    @Query(
        """
        select l from Lote l
        where l.producto.id = :productoId and l.estado = com.farmacia.sanidad.lote.EstadoLote.DISPONIBLE
          and l.cantidadDisponible > 0 and (l.fechaVencimiento is null or l.fechaVencimiento > :hoy)
        order by l.fechaVencimiento asc nulls last, l.createdAt asc
        """
    )
    fun disponiblesFefo(@Param("productoId") productoId: UUID, @Param("hoy") hoy: LocalDate): List<Lote>
}

data class RegistrarLoteRequest(
    @field:NotNull(message = "El producto es obligatorio") val productoId: UUID? = null,
    val proveedorId: UUID? = null,
    @field:NotBlank(message = "El número de lote es obligatorio") val numeroLote: String = "",
    val fechaFabricacion: LocalDate? = null,
    @field:NotNull(message = "La fecha de vencimiento es obligatoria") val fechaVencimiento: LocalDate? = null,
    @field:Min(value = 1, message = "La cantidad debe ser mayor a 0") val cantidad: Int = 0
)

data class LoteResponse(
    val id: UUID,
    val productoId: UUID,
    val productoNombre: String,
    val proveedorId: UUID?,
    val proveedorRazonSocial: String?,
    val numeroLote: String,
    val fechaFabricacion: LocalDate?,
    val fechaVencimiento: LocalDate?,
    val cantidadInicial: Int,
    val cantidadDisponible: Int,
    val estado: EstadoLote,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)

data class LoteFefoResponse(
    val loteId: UUID,
    val numeroLote: String,
    val fechaVencimiento: LocalDate?,
    val cantidadDisponible: Int,
    val cantidadATomar: Int
)

fun Lote.toResponse() = LoteResponse(
    id!!, producto!!.id!!, producto!!.nombreComercial, proveedor?.id, proveedor?.razonSocial,
    numeroLote, fechaFabricacion, fechaVencimiento, cantidadInicial, cantidadDisponible, estado, createdAt, updatedAt
)
