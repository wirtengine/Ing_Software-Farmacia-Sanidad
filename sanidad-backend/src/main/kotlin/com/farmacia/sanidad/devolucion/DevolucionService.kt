package com.farmacia.sanidad.devolucion

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.BusinessRuleException
import com.farmacia.sanidad.common.exception.EstadoInvalidoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.ValidacionException
import com.farmacia.sanidad.lote.LoteService
import com.farmacia.sanidad.producto.ProductoService
import com.farmacia.sanidad.proveedor.ProveedorService
import com.farmacia.sanidad.venta.VentaService
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
@Transactional
class DevolucionService(
    private val repo: DevolucionRepository,
    private val usuarioRepository: UsuarioRepository,
    private val ventaService: VentaService,
    private val proveedorService: ProveedorService,
    private val productoService: ProductoService,
    private val loteService: LoteService,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(DevolucionService::class.java)

    private val motivosCliente = setOf(MotivoDevolucion.ERROR_DESPACHO, MotivoDevolucion.DEFECTO_FABRICA)
    private val motivosProveedor = setOf(
        MotivoDevolucion.VENCIDO, MotivoDevolucion.PROXIMO_VENCER,
        MotivoDevolucion.DEFECTO_CALIDAD_EMPAQUE, MotivoDevolucion.DISCREPANCIA_PEDIDO
    )

    @Transactional(readOnly = true) fun listarTodas() = repo.recientes().map { it.toResponse() }
    @Transactional(readOnly = true) fun listarPorTipo(tipo: TipoDevolucion) = repo.porTipo(tipo).map { it.toResponse() }
    @Transactional(readOnly = true) fun obtenerPorId(id: UUID) = buscar(id).toResponse()

    /** Producto devuelto por cliente: queda en CUARENTENA (no vuelve al stock vendible). */
    fun registrarCliente(r: DevolucionClienteRequest, usuario: Usuario): DevolucionResponse {
        if (r.motivo !in motivosCliente)
            throw BusinessRuleException("Para devoluciones de cliente el motivo debe ser ERROR_DESPACHO o DEFECTO_FABRICA")
        val venta = ventaService.buscar(r.ventaId!!)
        val ref = usuarioRepository.getReferenceById(usuario.id!!)
        val d = Devolucion().apply {
            tipo = TipoDevolucion.CLIENTE
            estado = EstadoDevolucion.CUARENTENA
            this.venta = venta
            cliente = r.clienteId?.let { ventaService.buscarCliente(it) } ?: venta.cliente
            motivo = r.motivo!!
            usuarioRegistra = ref
            usuarioAutoriza = ref
            observaciones = r.observaciones?.trim()?.ifBlank { null }
        }
        r.detalles.forEach { det ->
            val vendido = venta.detalles.filter { it.producto?.id == det.productoId }.sumOf { it.cantidadBase ?: it.cantidad }
            if (vendido == 0) throw ValidacionException("El producto indicado no forma parte de esa venta")
            if (det.cantidad > vendido) throw ValidacionException("No se puede devolver más de lo vendido ($vendido)")
            d.detalles.add(DetalleDevolucion().apply {
                devolucion = d
                producto = productoService.buscar(det.productoId!!)
                lote = det.loteId?.let { loteService.buscar(it) }
                cantidad = det.cantidad
            })
        }
        val guardada = repo.saveAndFlush(d)
        em.refresh(guardada)
        log.info("Devolución de cliente folio {} registrada", guardada.folio)
        return guardada.toResponse()
    }

    /** Devolución a proveedor: descuenta del lote indicado y queda EN_TRANSITO. */
    fun registrarProveedor(r: DevolucionProveedorRequest, usuario: Usuario): DevolucionResponse {
        if (r.motivo !in motivosProveedor)
            throw BusinessRuleException("Motivo no permitido para devolución a proveedor")
        val proveedor = proveedorService.buscar(r.proveedorId!!)
        val ref = usuarioRepository.getReferenceById(usuario.id!!)
        val d = Devolucion().apply {
            tipo = TipoDevolucion.PROVEEDOR
            estado = EstadoDevolucion.EN_TRANSITO
            this.proveedor = proveedor
            motivo = r.motivo!!
            usuarioRegistra = ref
            usuarioAutoriza = ref
            notaCredito = r.notaCredito?.trim()?.ifBlank { null }
            observaciones = r.observaciones?.trim()?.ifBlank { null }
        }
        r.detalles.forEach { det ->
            val loteId = det.loteId ?: throw ValidacionException("Indique el lote de cada producto devuelto al proveedor")
            val lote = loteService.buscar(loteId)
            if (lote.producto?.id != det.productoId) throw ValidacionException("El lote no corresponde al producto")
            if (lote.cantidadDisponible < det.cantidad)
                throw ValidacionException("El lote ${lote.numeroLote} solo tiene ${lote.cantidadDisponible} unidades")
            d.detalles.add(DetalleDevolucion().apply {
                devolucion = d
                producto = productoService.buscar(det.productoId!!)
                this.lote = lote
                cantidad = det.cantidad
            })
        }
        val guardada = repo.saveAndFlush(d)
        guardada.detalles.forEach {
            db.ajustarLote(it.producto!!.id!!, it.lote!!.id!!, -it.cantidad, usuario.id!!,
                "DEVOLUCION_PROVEEDOR", "DEVOLUCION", guardada.id, "Devolución a proveedor")
        }
        em.refresh(guardada)
        log.info("Devolución a proveedor folio {} registrada", guardada.folio)
        return guardada.toResponse()
    }

    fun disponer(id: UUID, r: DisponerDevolucionRequest, usuario: Usuario): DevolucionResponse {
        val d = buscar(id)
        if (d.estado == EstadoDevolucion.DISPUESTA || d.estado == EstadoDevolucion.RECHAZADA)
            throw EstadoInvalidoException("La devolución ya fue dispuesta o rechazada")
        val ref = usuarioRepository.getReferenceById(usuario.id!!)
        d.estado = r.estado!!
        d.fechaDisposicion = LocalDateTime.now()
        d.responsableDisposicion = ref
        d.usuarioAutoriza = ref
        r.observaciones?.trim()?.ifBlank { null }?.let { d.observaciones = it }
        val guardada = repo.saveAndFlush(d)
        em.refresh(guardada)
        return guardada.toResponse()
    }

    fun buscar(id: UUID): Devolucion = repo.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Devolución no encontrada con id: $id") }
}
