package com.farmacia.sanidad.venta

import com.farmacia.sanidad.producto.UnidadMedida
import jakarta.validation.Valid
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class DetalleVentaRequest(
    @field:NotNull val productoId: UUID? = null,
    @field:NotNull(message = "La unidad de venta es obligatoria") val productoUnidadId: UUID? = null,
    @field:Min(value = 1, message = "La cantidad debe ser mayor a 0") val cantidad: Int = 0
)

data class VentaRequest(
    val clienteId: UUID? = null,
    val cajaId: UUID? = null,
    @field:NotNull(message = "El monto recibido es obligatorio") @field:DecimalMin("0.0") val montoRecibido: BigDecimal? = null,
    @field:NotEmpty(message = "Debe incluir al menos un producto") @field:Valid
    val detalles: List<DetalleVentaRequest> = emptyList()
)

data class AnularVentaRequest(@field:NotBlank(message = "El motivo de anulación es obligatorio") val motivo: String = "")

data class ClienteRequest(
    @field:NotBlank(message = "El nombre es obligatorio") @field:Size(max = 160) val nombre: String = "",
    @field:Size(max = 50) val identificacion: String? = null,
    @field:Size(max = 30) val telefono: String? = null
)

data class ClienteResponse(val id: UUID, val nombre: String, val identificacion: String?, val telefono: String?)

data class DetalleVentaResponse(
    val id: UUID,
    val productoId: UUID,
    val productoNombre: String,
    val loteId: UUID?,
    val numeroLote: String?,
    val productoUnidadId: UUID?,
    val cantidad: Int,
    val unidadVendida: UnidadMedida?,
    val cantidadBase: Int?,
    val precioUnitario: BigDecimal,
    val subtotal: BigDecimal?
)

data class VentaResponse(
    val id: UUID,
    val numeroComprobante: Long?,
    val clienteId: UUID?,
    val clienteNombre: String?,
    val usuarioVendedorId: UUID,
    val usuarioVendedorNombre: String,
    val cajaId: UUID,
    val estado: EstadoVenta,
    val tipoPago: TipoPago,
    val subtotal: BigDecimal,
    val total: BigDecimal,
    val montoRecibido: BigDecimal?,
    val vuelto: BigDecimal?,
    val motivoAnulacion: String?,
    val fechaAnulacion: LocalDateTime?,
    val detalles: List<DetalleVentaResponse>,
    val createdAt: LocalDateTime?
)

data class ItemComprobante(
    val nombreProducto: String,
    val unidad: String?,
    val cantidad: Int,
    val precioUnitario: BigDecimal,
    val subtotal: BigDecimal?
)

data class ComprobanteResponse(
    val ventaId: UUID,
    val numeroComprobante: Long?,
    val fecha: LocalDateTime?,
    val clienteNombre: String?,
    val vendedorNombre: String,
    val items: List<ItemComprobante>,
    val subtotal: BigDecimal,
    val total: BigDecimal,
    val montoRecibido: BigDecimal?,
    val vuelto: BigDecimal?
)

fun Cliente.toResponse() = ClienteResponse(id!!, nombre, identificacion, telefono)

fun DetalleVenta.toResponse() = DetalleVentaResponse(
    id!!, producto!!.id!!, producto!!.nombreComercial, lote?.id, lote?.numeroLote,
    productoUnidad?.id, cantidad, unidadVendida, cantidadBase, precioUnitario,
    subtotal ?: precioUnitario.multiply(BigDecimal(cantidad))
)

fun Venta.toResponse() = VentaResponse(
    id!!, numeroComprobante, cliente?.id, cliente?.nombre,
    usuarioVendedor!!.id!!, usuarioVendedor!!.nombreCompleto, caja!!.id!!,
    estado, tipoPago, subtotal, total, montoRecibido, vuelto, motivoAnulacion, fechaAnulacion,
    detalles.map { it.toResponse() }, createdAt
)

fun Venta.toComprobante() = ComprobanteResponse(
    id!!, numeroComprobante, createdAt, cliente?.nombre, usuarioVendedor!!.nombreCompleto,
    detalles.map {
        ItemComprobante(it.producto!!.nombreComercial, it.unidadVendida?.name, it.cantidad, it.precioUnitario,
            it.subtotal ?: it.precioUnitario.multiply(BigDecimal(it.cantidad)))
    },
    subtotal, total, montoRecibido, vuelto
)
