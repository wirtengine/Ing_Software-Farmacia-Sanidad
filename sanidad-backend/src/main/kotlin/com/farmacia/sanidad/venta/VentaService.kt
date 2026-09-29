package com.farmacia.sanidad.venta

import com.farmacia.sanidad.auth.entity.RolUsuario
import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.caja.CajaService
import com.farmacia.sanidad.caja.EstadoCaja
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.BusinessRuleException
import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import com.farmacia.sanidad.common.exception.EstadoInvalidoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.StockInsuficienteException
import com.farmacia.sanidad.producto.ProductoUnidadRepository
import com.farmacia.sanidad.producto.real
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID

@Service
@Transactional
class VentaService(
    private val ventaRepository: VentaRepository,
    private val clienteRepository: ClienteRepository,
    private val usuarioRepository: UsuarioRepository,
    private val unidadRepository: ProductoUnidadRepository,
    private val cajaService: CajaService,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(VentaService::class.java)

    @Transactional(readOnly = true) fun listarTodas() = ventaRepository.recientes().map { it.toResponse() }
    @Transactional(readOnly = true) fun obtenerPorId(id: UUID) = buscar(id).toResponse()
    @Transactional(readOnly = true) fun obtenerComprobante(id: UUID) = buscar(id).toComprobante()

    fun crear(r: VentaRequest, vendedor: Usuario): VentaResponse {
        val caja = if (r.cajaId != null) cajaService.buscar(r.cajaId) else cajaService.cajaAbierta()
        if (caja.estado != EstadoCaja.ABIERTA) throw EstadoInvalidoException("La caja indicada no está abierta")

        val venta = Venta().apply {
            this.caja = caja
            usuarioVendedor = usuarioRepository.getReferenceById(vendedor.id!!)
            cliente = r.clienteId?.let { buscarCliente(it) }
            estado = EstadoVenta.COMPLETADA
            tipoPago = TipoPago.EFECTIVO
        }

        var total = BigDecimal.ZERO
        val basePorProducto = mutableMapOf<UUID, Int>()

        r.detalles.forEach { d ->
            val unidad = unidadRepository.findById(d.productoUnidadId!!)
                .orElseThrow { RecursoNoEncontradoException("Unidad de venta no encontrada: ${d.productoUnidadId}") }
            val producto = unidad.producto!!.real()
            if (producto.id != d.productoId) throw BusinessRuleException("La unidad no pertenece al producto indicado")
            if (!producto.activo || !unidad.activo)
                throw BusinessRuleException("'${producto.nombreComercial}' no está disponible para la venta")
            if (producto.requiereReceta && vendedor.rol == RolUsuario.VENDEDOR)
                throw BusinessRuleException("'${producto.nombreComercial}' requiere receta: debe dispensarlo un regente")

            // Fraccionamiento: cantidadBase = cantidad × factor_base
            val cantidadBase = d.cantidad * unidad.factorBase
            basePorProducto[producto.id!!] = (basePorProducto[producto.id!!] ?: 0) + cantidadBase
            total = total.add(unidad.precioVenta.multiply(BigDecimal(d.cantidad)))

            venta.detalles.add(DetalleVenta().apply {
                this.venta = venta
                this.producto = producto
                productoUnidad = unidad
                cantidad = d.cantidad
                unidadVendida = unidad.unidad
                this.cantidadBase = cantidadBase
                precioUnitario = unidad.precioVenta
            })
        }

        basePorProducto.forEach { (productoId, requerido) ->
            val stock = db.stockProducto(productoId)
            if (stock < requerido) {
                val nombre = venta.detalles.first { it.producto?.id == productoId }.producto!!.nombreComercial
                throw StockInsuficienteException("Stock insuficiente para '$nombre'. Disponible: $stock, requerido: $requerido (unidad base)")
            }
        }

        val recibido = r.montoRecibido!!
        if (recibido < total) throw BusinessRuleException("El monto recibido es menor al total de la venta")
        venta.subtotal = total
        venta.total = total
        venta.montoRecibido = recibido
        venta.vuelto = recibido.subtract(total)

        val guardada = ventaRepository.saveAndFlush(venta)

        // Descuento FEFO en la BD, por línea, en unidad base
        guardada.detalles.forEach { det ->
            db.registrarSalidaFefo(
                det.producto!!.id!!, det.cantidadBase!!, vendedor.id!!, "SALIDA_VENTA",
                "VENTA", guardada.id, null
            )
        }
        em.refresh(guardada)
        log.info("Venta #{} registrada por {} — total C$ {}", guardada.numeroComprobante, vendedor.nombreUsuario, total)
        return guardada.toResponse()
    }

    fun anular(id: UUID, r: AnularVentaRequest, autoriza: Usuario): VentaResponse {
        val venta = buscar(id)
        if (venta.estado == EstadoVenta.ANULADA) throw EstadoInvalidoException("La venta ya se encuentra anulada")
        if (autoriza.rol == RolUsuario.VENDEDOR) throw BusinessRuleException("Solo ADMIN o REGENTE pueden anular ventas")
        em.flush()

        // Valida mismo día, rol y estado; marca la venta como ANULADA
        db.anularVenta(id, autoriza.id!!, autoriza.id!!, r.motivo.trim())

        // Devuelve el stock exactamente a los lotes de los que salió
        db.salidasPorReferencia("SALIDA_VENTA", "VENTA", id).forEach { (productoId, loteId, cantidad) ->
            if (loteId != null) {
                db.ajustarLote(productoId, loteId, cantidad, autoriza.id!!, "ANULACION_VENTA", "VENTA", id,
                    "Anulación de venta: ${r.motivo.trim()}")
            }
        }
        em.refresh(venta)
        log.info("Venta #{} anulada por {}", venta.numeroComprobante, autoriza.nombreUsuario)
        return venta.toResponse()
    }

    // ---------------- Clientes ----------------

    @Transactional(readOnly = true) fun listarClientes() = clienteRepository.findAllByOrderByNombre().map { it.toResponse() }
    @Transactional(readOnly = true) fun obtenerCliente(id: UUID) = buscarCliente(id).toResponse()
    @Transactional(readOnly = true) fun buscarClientes(texto: String) =
        if (texto.isBlank()) emptyList() else clienteRepository.buscar(texto.trim()).map { it.toResponse() }

    fun crearCliente(r: ClienteRequest): ClienteResponse {
        val ident = r.identificacion?.trim()?.ifBlank { null }
        if (ident != null && clienteRepository.existsByIdentificacion(ident))
            throw CodigoDuplicadoException("Ya existe un cliente con la identificación '$ident'")
        return clienteRepository.save(Cliente().apply {
            nombre = r.nombre.trim(); identificacion = ident; telefono = r.telefono?.trim()?.ifBlank { null }
        }).toResponse()
    }

    fun actualizarCliente(id: UUID, r: ClienteRequest): ClienteResponse {
        val c = buscarCliente(id)
        val ident = r.identificacion?.trim()?.ifBlank { null }
        if (ident != null && ident != c.identificacion && clienteRepository.existsByIdentificacion(ident))
            throw CodigoDuplicadoException("Ya existe un cliente con la identificación '$ident'")
        c.nombre = r.nombre.trim(); c.identificacion = ident; c.telefono = r.telefono?.trim()?.ifBlank { null }
        return clienteRepository.save(c).toResponse()
    }

    fun buscar(id: UUID): Venta = ventaRepository.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Venta no encontrada con id: $id") }

    fun buscarCliente(id: UUID): Cliente = clienteRepository.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Cliente no encontrado con id: $id") }
}
