package com.farmacia.sanidad.venta

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.caja.Caja
import com.farmacia.sanidad.lote.Lote
import com.farmacia.sanidad.producto.Producto
import com.farmacia.sanidad.producto.ProductoUnidad
import com.farmacia.sanidad.producto.UnidadMedida
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

enum class EstadoVenta { ABIERTA, COMPLETADA, ANULADA }
enum class TipoPago { EFECTIVO }

@Entity
@Table(name = "clientes", schema = "farmacia")
class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    @Column(name = "nombre", nullable = false) var nombre: String = ""
    @Column(name = "identificacion", unique = true) var identificacion: String? = null
    @Column(name = "telefono") var telefono: String? = null
    @CreationTimestamp @Column(name = "created_at", updatable = false) var createdAt: LocalDateTime? = null
    @UpdateTimestamp @Column(name = "updated_at") var updatedAt: LocalDateTime? = null
}

@Entity
@Table(name = "ventas", schema = "farmacia")
class Venta {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    // Columna "generated always as identity": la genera PostgreSQL
    @Column(name = "numero_comprobante", insertable = false, updatable = false)
    var numeroComprobante: Long? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cliente_id")
    var cliente: Cliente? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_vendedor_id", nullable = false)
    var usuarioVendedor: Usuario? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "caja_id", nullable = false)
    var caja: Caja? = null

    @Enumerated(EnumType.STRING) @Column(name = "estado", nullable = false)
    var estado: EstadoVenta = EstadoVenta.ABIERTA

    @Enumerated(EnumType.STRING) @Column(name = "tipo_pago", nullable = false)
    var tipoPago: TipoPago = TipoPago.EFECTIVO

    @Column(name = "subtotal", nullable = false) var subtotal: BigDecimal = BigDecimal.ZERO
    @Column(name = "total", nullable = false) var total: BigDecimal = BigDecimal.ZERO
    @Column(name = "monto_recibido", nullable = false) var montoRecibido: BigDecimal = BigDecimal.ZERO
    @Column(name = "vuelto", nullable = false) var vuelto: BigDecimal = BigDecimal.ZERO
    @Column(name = "motivo_anulacion", columnDefinition = "text") var motivoAnulacion: String? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_autorizo_anulacion_id")
    var usuarioAutorizoAnulacion: Usuario? = null

    @Column(name = "fecha_anulacion") var fechaAnulacion: LocalDateTime? = null

    // La fecha la pone la BD (now()) para que la regla "anular el mismo día" coincida
    @Column(name = "created_at", insertable = false, updatable = false) var createdAt: LocalDateTime? = null
    @Column(name = "updated_at", insertable = false) var updatedAt: LocalDateTime? = null

    @OneToMany(mappedBy = "venta", cascade = [CascadeType.ALL], orphanRemoval = true)
    var detalles: MutableList<DetalleVenta> = mutableListOf()
}

@Entity
@Table(name = "detalles_venta", schema = "farmacia")
class DetalleVenta {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "venta_id", nullable = false)
    var venta: Venta? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false)
    var producto: Producto? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lote_id")
    var lote: Lote? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_unidad_id")
    var productoUnidad: ProductoUnidad? = null

    /** Cantidad en la unidad vendida (ej. 2 blísteres). */
    @Column(name = "cantidad", nullable = false) var cantidad: Int = 0

    @Enumerated(EnumType.STRING) @Column(name = "unidad_vendida")
    var unidadVendida: UnidadMedida? = null

    /** Cantidad en unidad base (ej. 20 tabletas). Es lo que se descuenta del inventario. */
    @Column(name = "cantidad_base") var cantidadBase: Int? = null

    @Column(name = "precio_unitario", nullable = false) var precioUnitario: BigDecimal = BigDecimal.ZERO

    // Columna generada por PostgreSQL (cantidad * precio_unitario)
    @Column(name = "subtotal", insertable = false, updatable = false) var subtotal: BigDecimal? = null
}

interface ClienteRepository : JpaRepository<Cliente, UUID> {
    fun existsByIdentificacion(identificacion: String): Boolean
    fun findAllByOrderByNombre(): List<Cliente>

    @Query(
        """
        select c from Cliente c
        where lower(c.nombre) like lower(concat('%', :texto, '%'))
           or lower(coalesce(c.identificacion, '')) like lower(concat('%', :texto, '%'))
        order by c.nombre
        """
    )
    fun buscar(@Param("texto") texto: String): List<Cliente>
}

interface VentaRepository : JpaRepository<Venta, UUID> {
    @Query("select v from Venta v order by v.createdAt desc")
    fun recientes(): List<Venta>
}
