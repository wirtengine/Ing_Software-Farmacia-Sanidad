package com.farmacia.sanidad.devolucion

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.lote.Lote
import com.farmacia.sanidad.producto.Producto
import com.farmacia.sanidad.proveedor.Proveedor
import com.farmacia.sanidad.venta.Cliente
import com.farmacia.sanidad.venta.Venta
import jakarta.persistence.*
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime
import java.util.UUID

enum class TipoDevolucion { CLIENTE, PROVEEDOR }
enum class MotivoDevolucion { ERROR_DESPACHO, DEFECTO_FABRICA, VENCIDO, PROXIMO_VENCER, DEFECTO_CALIDAD_EMPAQUE, DISCREPANCIA_PEDIDO }
enum class EstadoDevolucion { REGISTRADA, CUARENTENA, EN_TRANSITO, DISPUESTA, RECHAZADA }

@Entity
@Table(name = "devoluciones", schema = "farmacia")
class Devolucion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(name = "folio", insertable = false, updatable = false) var folio: Long? = null

    @Enumerated(EnumType.STRING) @Column(name = "tipo", nullable = false)
    var tipo: TipoDevolucion = TipoDevolucion.CLIENTE

    @Enumerated(EnumType.STRING) @Column(name = "estado", nullable = false)
    var estado: EstadoDevolucion = EstadoDevolucion.REGISTRADA

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "venta_id") var venta: Venta? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "proveedor_id") var proveedor: Proveedor? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cliente_id") var cliente: Cliente? = null

    @Enumerated(EnumType.STRING) @Column(name = "motivo", nullable = false)
    var motivo: MotivoDevolucion = MotivoDevolucion.ERROR_DESPACHO

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_registra_id", nullable = false)
    var usuarioRegistra: Usuario? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_autoriza_id")
    var usuarioAutoriza: Usuario? = null

    @Column(name = "nota_credito") var notaCredito: String? = null
    @Column(name = "fecha_disposicion") var fechaDisposicion: LocalDateTime? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "responsable_disposicion_id")
    var responsableDisposicion: Usuario? = null

    @Column(name = "observaciones", columnDefinition = "text") var observaciones: String? = null
    @Column(name = "created_at", insertable = false, updatable = false) var createdAt: LocalDateTime? = null
    @Column(name = "updated_at", insertable = false) var updatedAt: LocalDateTime? = null

    @OneToMany(mappedBy = "devolucion", cascade = [CascadeType.ALL], orphanRemoval = true)
    var detalles: MutableList<DetalleDevolucion> = mutableListOf()
}

@Entity
@Table(name = "detalles_devolucion", schema = "farmacia")
class DetalleDevolucion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "devolucion_id", nullable = false) var devolucion: Devolucion? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false) var producto: Producto? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lote_id") var lote: Lote? = null
    @Column(name = "cantidad", nullable = false) var cantidad: Int = 0
}

interface DevolucionRepository : JpaRepository<Devolucion, UUID> {
    @Query("select d from Devolucion d order by d.createdAt desc")
    fun recientes(): List<Devolucion>

    @Query("select d from Devolucion d where d.tipo = :tipo order by d.createdAt desc")
    fun porTipo(@Param("tipo") tipo: TipoDevolucion): List<Devolucion>
}

data class DetalleDevolucionRequest(
    @field:NotNull val productoId: UUID? = null,
    val loteId: UUID? = null,
    @field:Min(1) val cantidad: Int = 0
)

data class DevolucionClienteRequest(
    @field:NotNull(message = "La venta es obligatoria") val ventaId: UUID? = null,
    val clienteId: UUID? = null,
    @field:NotNull val motivo: MotivoDevolucion? = null,
    val observaciones: String? = null,
    @field:NotEmpty @field:Valid val detalles: List<DetalleDevolucionRequest> = emptyList()
)

data class DevolucionProveedorRequest(
    @field:NotNull(message = "El proveedor es obligatorio") val proveedorId: UUID? = null,
    @field:NotNull val motivo: MotivoDevolucion? = null,
    val notaCredito: String? = null,
    val observaciones: String? = null,
    @field:NotEmpty @field:Valid val detalles: List<DetalleDevolucionRequest> = emptyList()
)

data class DisponerDevolucionRequest(
    @field:NotNull val estado: EstadoDevolucion? = null,
    val observaciones: String? = null
)

data class DetalleDevolucionResponse(
    val id: UUID, val productoId: UUID, val productoNombre: String,
    val loteId: UUID?, val numeroLote: String?, val cantidad: Int
)

data class DevolucionResponse(
    val id: UUID,
    val folio: Long?,
    val tipo: TipoDevolucion,
    val estado: EstadoDevolucion,
    val ventaId: UUID?,
    val proveedorId: UUID?,
    val proveedorRazonSocial: String?,
    val clienteId: UUID?,
    val clienteNombre: String?,
    val motivo: MotivoDevolucion,
    val usuarioRegistraId: UUID,
    val usuarioRegistraNombre: String,
    val usuarioAutorizaId: UUID?,
    val notaCredito: String?,
    val fechaDisposicion: LocalDateTime?,
    val observaciones: String?,
    val detalles: List<DetalleDevolucionResponse>,
    val createdAt: LocalDateTime?
)

fun Devolucion.toResponse() = DevolucionResponse(
    id!!, folio, tipo, estado, venta?.id, proveedor?.id, proveedor?.razonSocial, cliente?.id, cliente?.nombre,
    motivo, usuarioRegistra!!.id!!, usuarioRegistra!!.nombreCompleto, usuarioAutoriza?.id, notaCredito,
    fechaDisposicion, observaciones,
    detalles.map { DetalleDevolucionResponse(it.id!!, it.producto!!.id!!, it.producto!!.nombreComercial, it.lote?.id, it.lote?.numeroLote, it.cantidad) },
    createdAt
)
