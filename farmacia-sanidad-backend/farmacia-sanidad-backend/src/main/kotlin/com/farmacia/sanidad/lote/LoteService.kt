package com.farmacia.sanidad.lote

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.StockInsuficienteException
import com.farmacia.sanidad.producto.ProductoService
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
@Transactional
class LoteService(
    private val repo: LoteRepository,
    private val productoService: ProductoService,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(LoteService::class.java)

    @Transactional(readOnly = true) fun listarTodos() = repo.listarRecientes().map { it.toResponse() }
    @Transactional(readOnly = true) fun listarPorProducto(productoId: UUID) = repo.porProducto(productoId).map { it.toResponse() }
    @Transactional(readOnly = true) fun obtenerPorId(id: UUID) = buscar(id).toResponse()

    @Transactional(readOnly = true)
    fun proximosAVencer(dias: Long) = repo.proximosAVencer(LocalDate.now().plusDays(dias)).map { it.toResponse() }

    /** Vista previa FEFO (no bloquea filas ni modifica nada). */
    @Transactional(readOnly = true)
    fun previewFefo(productoId: UUID, cantidad: Int): List<LoteFefoResponse> {
        productoService.buscar(productoId)
        var restante = cantidad
        val resultado = mutableListOf<LoteFefoResponse>()
        for (l in repo.disponiblesFefo(productoId, LocalDate.now())) {
            if (restante <= 0) break
            val tomar = minOf(restante, l.cantidadDisponible)
            resultado += LoteFefoResponse(l.id!!, l.numeroLote, l.fechaVencimiento, l.cantidadDisponible, tomar)
            restante -= tomar
        }
        if (restante > 0) throw StockInsuficienteException("Stock insuficiente. Faltan $restante unidades base")
        return resultado
    }

    /** Usa farmacia.fn_registrar_entrada_lote (la BD exige rol ADMIN). */
    fun registrarEntrada(r: RegistrarLoteRequest, usuario: Usuario): LoteResponse {
        productoService.buscar(r.productoId!!)
        em.flush()
        val loteId = db.registrarEntradaLote(
            r.productoId, r.proveedorId, r.numeroLote.trim(),
            r.fechaFabricacion, r.fechaVencimiento, r.cantidad, usuario.id!!
        )
        log.info("Entrada de lote {} registrada por {}", r.numeroLote, usuario.nombreUsuario)
        return buscar(loteId).toResponse()
    }

    fun buscar(id: UUID): Lote = repo.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Lote no encontrado con id: $id") }
}
