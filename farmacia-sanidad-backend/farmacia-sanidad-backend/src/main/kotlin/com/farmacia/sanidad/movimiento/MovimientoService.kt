package com.farmacia.sanidad.movimiento

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.ValidacionException
import com.farmacia.sanidad.lote.LoteService
import com.farmacia.sanidad.producto.ProductoService
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class MovimientoService(
    private val repo: MovimientoInventarioRepository,
    private val productoService: ProductoService,
    private val loteService: LoteService,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(MovimientoService::class.java)

    @Transactional(readOnly = true) fun listarTodos() = repo.recientes().map { it.toResponse() }
    @Transactional(readOnly = true) fun listarPorProducto(id: UUID) = repo.porProducto(id).map { it.toResponse() }

    /**
     * AJUSTE_ENTRADA: requiere lote (la BD no permite superar la cantidad inicial del lote).
     * AJUSTE_SALIDA: con lote descuenta de ese lote; sin lote aplica FEFO.
     */
    fun registrarAjuste(r: AjusteInventarioRequest, usuario: Usuario): Map<String, Int> {
        val producto = productoService.buscar(r.productoId!!)
        em.flush()
        when (r.tipo) {
            TipoMovimiento.AJUSTE_ENTRADA -> {
                val loteId = r.loteId ?: throw ValidacionException("Para un ajuste de entrada debe indicar el lote")
                val lote = loteService.buscar(loteId)
                if (lote.cantidadDisponible + r.cantidadBase > lote.cantidadInicial)
                    throw ValidacionException("El ajuste supera la cantidad inicial del lote (${lote.cantidadInicial}). Registre un lote nuevo.")
                db.ajustarLote(producto.id!!, loteId, r.cantidadBase, usuario.id!!, "AJUSTE_ENTRADA", "AJUSTE_MANUAL", null, r.motivo.trim())
            }
            TipoMovimiento.AJUSTE_SALIDA -> {
                if (r.loteId != null) {
                    val lote = loteService.buscar(r.loteId)
                    if (lote.cantidadDisponible < r.cantidadBase)
                        throw ValidacionException("El lote solo tiene ${lote.cantidadDisponible} unidades disponibles")
                    db.ajustarLote(producto.id!!, r.loteId, -r.cantidadBase, usuario.id!!, "AJUSTE_SALIDA", "AJUSTE_MANUAL", null, r.motivo.trim())
                } else {
                    db.seleccionarLotesFefo(producto.id!!, r.cantidadBase).forEach { a ->
                        db.ajustarLote(producto.id!!, a.loteId, -a.cantidad, usuario.id!!, "AJUSTE_SALIDA", "AJUSTE_MANUAL", null, r.motivo.trim())
                    }
                }
            }
            else -> throw ValidacionException("El tipo debe ser AJUSTE_ENTRADA o AJUSTE_SALIDA")
        }
        log.info("Ajuste {} de {} u. en producto {} por {}", r.tipo, r.cantidadBase, producto.nombreComercial, usuario.nombreUsuario)
        return mapOf("resultado" to r.cantidadBase, "stockActual" to db.stockProducto(producto.id!!))
    }
}
