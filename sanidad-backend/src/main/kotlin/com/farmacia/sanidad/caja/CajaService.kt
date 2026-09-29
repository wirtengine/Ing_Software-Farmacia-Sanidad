package com.farmacia.sanidad.caja

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.EstadoInvalidoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class CajaService(
    private val repo: CajaRepository,
    private val db: FarmaciaDb,
    private val em: EntityManager
) {
    private val log = LoggerFactory.getLogger(CajaService::class.java)

    @Transactional(readOnly = true) fun listarTodas() = repo.recientes().map { toResponse(it) }
    @Transactional(readOnly = true) fun obtenerPorId(id: UUID) = toResponse(buscar(id))

    /** La base de datos maneja UNA caja abierta a la vez para toda la farmacia. */
    @Transactional(readOnly = true)
    fun obtenerCajaActual(): CajaResponse = toResponse(
        repo.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
            ?: throw RecursoNoEncontradoException("No hay una caja abierta")
    )

    fun cajaAbierta(): Caja = repo.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
        ?: throw EstadoInvalidoException("No hay una caja abierta. Un administrador debe abrirla primero")

    fun abrir(r: AbrirCajaRequest, usuario: Usuario): CajaResponse {
        val id = db.abrirCaja(usuario.id!!, r.montoInicial!!)
        log.info("Caja abierta por {} con C$ {}", usuario.nombreUsuario, r.montoInicial)
        return toResponse(buscar(id))
    }

    fun cerrar(id: UUID, r: CerrarCajaRequest, usuario: Usuario): CajaResponse {
        val caja = buscar(id)
        if (caja.estado != EstadoCaja.ABIERTA) throw EstadoInvalidoException("La caja ya está cerrada")
        em.flush()
        db.cerrarCaja(id, usuario.id!!, r.montoFinalReal!!)
        em.refresh(caja)
        log.info("Caja {} cerrada por {}", id, usuario.nombreUsuario)
        return toResponse(caja)
    }

    fun buscar(id: UUID): Caja = repo.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Caja no encontrada con id: $id") }

    private fun toResponse(c: Caja) = CajaResponse(
        id = c.id!!,
        usuarioAperturaId = c.usuarioApertura!!.id!!,
        usuarioAperturaNombre = c.usuarioApertura!!.nombreCompleto,
        fechaApertura = c.fechaApertura,
        montoInicial = c.montoInicial,
        estado = c.estado,
        fechaCierre = c.fechaCierre,
        totalVentasEfectivo = if (c.estado == EstadoCaja.ABIERTA) repo.totalVentas(c.id!!) else c.totalVentasEfectivo,
        montoFinalTeorico = c.montoFinalTeorico,
        montoFinalReal = c.montoFinalReal,
        diferencia = c.diferencia,
        usuarioCierreId = c.usuarioCierre?.id,
        usuarioCierreNombre = c.usuarioCierre?.nombreCompleto
    )
}
