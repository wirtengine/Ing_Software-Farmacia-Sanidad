package com.farmacia.sanidad.movimiento

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
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
class DispensacionService(
    private val dispensacionRepository: DispensacionRepository,
    private val recetaRepository: RecetaRepository,
    private val usuarioRepository: UsuarioRepository,
    private val productoService: ProductoService,
    private val loteService: LoteService,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(DispensacionService::class.java)

    @Transactional(readOnly = true) fun listarTodas() = dispensacionRepository.recientes().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun obtenerPorId(id: UUID) = dispensacionRepository.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Dispensación no encontrada con id: $id") }.toResponse()

    fun registrar(r: DispensacionRequest, regente: Usuario): DispensacionResponse {
        val numero = r.numeroReceta.trim()
        if (recetaRepository.existsByNumeroReceta(numero))
            throw CodigoDuplicadoException("Ya existe una receta registrada con el número '$numero'")

        val receta = recetaRepository.save(Receta().apply {
            numeroReceta = numero
            fechaEmision = r.fechaEmision
            prescriptor = r.prescriptor.trim()
            observaciones = r.observaciones?.trim()?.ifBlank { null }
        })
        val dispensacion = dispensacionRepository.save(Dispensacion().apply {
            this.receta = receta
            usuarioRegente = usuarioRepository.getReferenceById(regente.id!!)
        })
        em.flush()

        r.detalles.forEach { d ->
            val producto = productoService.buscar(d.productoId!!)
            if (!producto.requiereReceta) {
                log.debug("Se dispensa con receta un producto que no la requiere: {}", producto.nombreComercial)
            }
            db.registrarSalidaFefo(
                producto.id!!, d.cantidad, regente.id!!, "DISPENSACION_RECETA",
                "DISPENSACION", dispensacion.id, "Dispensación receta $numero"
            )
            val salidas = db.salidasPorReferencia("DISPENSACION_RECETA", "DISPENSACION", dispensacion.id!!, producto.id)
            if (salidas.isEmpty()) throw ValidacionException("No se pudo determinar el lote dispensado")
            salidas.forEach { (_, loteId, cantidad) ->
                if (dispensacion.detalles.none { it.producto?.id == producto.id && it.lote?.id == loteId }) {
                    dispensacion.detalles.add(DetalleDispensacion().apply {
                        this.dispensacion = dispensacion
                        this.producto = producto
                        this.lote = loteService.buscar(loteId)
                        this.cantidad = cantidad
                    })
                }
            }
        }
        val guardada = dispensacionRepository.saveAndFlush(dispensacion)
        log.info("Dispensación registrada: receta={} regente={}", numero, regente.nombreUsuario)
        return guardada.toResponse()
    }
}
