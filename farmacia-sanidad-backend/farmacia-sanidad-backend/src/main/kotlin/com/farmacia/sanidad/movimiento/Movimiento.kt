package com.farmacia.sanidad.movimiento

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.lote.Lote
import com.farmacia.sanidad.producto.Producto
import jakarta.persistence.*
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.CreationTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

enum class TipoMovimiento {
    ENTRADA_COMPRA, SALIDA_VENTA, DISPENSACION_RECETA, AJUSTE_ENTRADA,
    AJUSTE_SALIDA, DEVOLUCION_PROVEEDOR, DEVOLUCION_CLIENTE_REINGRESO, ANULACION_VENTA
}

@Entity
@Table(name = "movimientos_inventario", schema = "farmacia")
class MovimientoInventario {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false)
    var producto: Producto? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lote_id")
    var lote: Lote? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_id", nullable = false)
    var usuario: Usuario? = null

    @Enumerated(EnumType.STRING) @Column(name = "tipo", nullable = false)
    var tipo: TipoMovimiento = TipoMovimiento.AJUSTE_ENTRADA

    @Column(name = "cantidad", nullable = false) var cantidad: Int = 0
    @Column(name = "cantidad_base") var cantidadBase: Int? = null
    @Column(name = "referencia_tipo") var referenciaTipo: String? = null
    @Column(name = "referencia_id") var referenciaId: UUID? = null
    @Column(name = "stock_anterior") var stockAnterior: Int? = null
    @Column(name = "stock_posterior") var stockPosterior: Int? = null
    @Column(name = "motivo", columnDefinition = "text") var motivo: String? = null

    @Column(name = "created_at", insertable = false, updatable = false)
    var createdAt: LocalDateTime? = null
}

@Entity
@Table(name = "recetas", schema = "farmacia")
class Receta {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    @Column(name = "numero_receta", nullable = false, unique = true) var numeroReceta: String = ""
    @Column(name = "fecha_emision", nullable = false) var fechaEmision: LocalDate? = null
    @Column(name = "prescriptor", nullable = false) var prescriptor: String = ""
    @Column(name = "observaciones", columnDefinition = "text") var observaciones: String? = null
    @CreationTimestamp @Column(name = "created_at", updatable = false) var createdAt: LocalDateTime? = null
}

@Entity
@Table(name = "dispensaciones", schema = "farmacia")
class Dispensacion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "receta_id", nullable = false)
    var receta: Receta? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_regente_id", nullable = false)
    var usuarioRegente: Usuario? = null

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @OneToMany(mappedBy = "dispensacion", cascade = [CascadeType.ALL], orphanRemoval = true)
    var detalles: MutableList<DetalleDispensacion> = mutableListOf()
}

@Entity
@Table(name = "detalles_dispensacion", schema = "farmacia")
class DetalleDispensacion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dispensacion_id", nullable = false)
    var dispensacion: Dispensacion? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false)
    var producto: Producto? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lote_id", nullable = false)
    var lote: Lote? = null

    @Column(name = "cantidad", nullable = false) var cantidad: Int = 0
}

interface MovimientoInventarioRepository : JpaRepository<MovimientoInventario, UUID> {
    @Query("select m from MovimientoInventario m order by m.createdAt desc")
    fun recientes(): List<MovimientoInventario>

    @Query("select m from MovimientoInventario m where m.producto.id = :productoId order by m.createdAt desc")
    fun porProducto(@Param("productoId") productoId: UUID): List<MovimientoInventario>
}

interface RecetaRepository : JpaRepository<Receta, UUID> {
    fun existsByNumeroReceta(numeroReceta: String): Boolean
}

interface DispensacionRepository : JpaRepository<Dispensacion, UUID> {
    @Query("select d from Dispensacion d order by d.createdAt desc")
    fun recientes(): List<Dispensacion>
}

// ---------------- DTOs ----------------

data class AjusteInventarioRequest(
    @field:NotNull val productoId: UUID? = null,
    val loteId: UUID? = null,
    @field:NotNull val tipo: TipoMovimiento? = null,
    @field:Min(value = 1, message = "La cantidad debe ser mayor a 0") val cantidadBase: Int = 0,
    @field:NotBlank(message = "El motivo del ajuste es obligatorio") val motivo: String = ""
)

data class MovimientoResponse(
    val id: UUID,
    val productoId: UUID,
    val productoNombre: String,
    val loteId: UUID?,
    val numeroLote: String?,
    val usuarioId: UUID,
    val usuarioNombre: String,
    val tipo: TipoMovimiento,
    val cantidad: Int,
    val cantidadBase: Int?,
    val referenciaTipo: String?,
    val referenciaId: UUID?,
    val stockAnterior: Int?,
    val stockPosterior: Int?,
    val motivo: String?,
    val createdAt: LocalDateTime?
)

data class DetalleDispensacionRequest(
    @field:NotNull val productoId: UUID? = null,
    @field:Min(1) val cantidad: Int = 0,
    val loteId: UUID? = null
)

data class DispensacionRequest(
    @field:NotBlank(message = "El número de receta es obligatorio") val numeroReceta: String = "",
    @field:NotNull(message = "La fecha de emisión es obligatoria") val fechaEmision: LocalDate? = null,
    @field:NotBlank(message = "El médico prescriptor es obligatorio") val prescriptor: String = "",
    val observaciones: String? = null,
    @field:NotEmpty(message = "Debe incluir al menos un producto") @field:Valid
    val detalles: List<DetalleDispensacionRequest> = emptyList()
)

data class DetalleDispensacionResponse(
    val id: UUID, val productoId: UUID, val productoNombre: String,
    val loteId: UUID, val numeroLote: String, val cantidad: Int
)

data class DispensacionResponse(
    val id: UUID,
    val recetaId: UUID,
    val numeroReceta: String,
    val fechaEmision: LocalDate?,
    val prescriptor: String?,
    val usuarioRegenteId: UUID,
    val usuarioRegenteNombre: String,
    val detalles: List<DetalleDispensacionResponse>,
    val createdAt: LocalDateTime?
)

fun MovimientoInventario.toResponse() = MovimientoResponse(
    id!!, producto!!.id!!, producto!!.nombreComercial, lote?.id, lote?.numeroLote,
    usuario!!.id!!, usuario!!.nombreCompleto, tipo, cantidad, cantidadBase,
    referenciaTipo, referenciaId, stockAnterior, stockPosterior, motivo, createdAt
)

fun Dispensacion.toResponse() = DispensacionResponse(
    id!!, receta!!.id!!, receta!!.numeroReceta, receta!!.fechaEmision, receta!!.prescriptor,
    usuarioRegente!!.id!!, usuarioRegente!!.nombreCompleto,
    detalles.map {
        DetalleDispensacionResponse(it.id!!, it.producto!!.id!!, it.producto!!.nombreComercial,
            it.lote!!.id!!, it.lote!!.numeroLote, it.cantidad)
    },
    createdAt
)
