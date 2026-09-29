package com.farmacia.sanidad.estante

import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class EstanteService(private val repo: EstanteRepository) {

    @Transactional(readOnly = true)
    fun listarTodos() = repo.findAllByOrderByCodigo().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun listarActivos() = repo.findByActivoTrueOrderByCodigo().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun obtenerPorId(id: UUID) = buscar(id).toResponse()

    fun crear(r: EstanteRequest): EstanteResponse {
        val codigo = r.codigo.trim().uppercase()
        if (repo.existsByCodigo(codigo)) throw CodigoDuplicadoException("Ya existe un estante con el código '$codigo'")
        val e = Estante().apply {
            this.codigo = codigo
            descripcion = r.descripcion?.trim()?.ifBlank { null }
            ubicacionFisica = r.ubicacionFisica?.trim()?.ifBlank { null }
        }
        return repo.save(e).toResponse()
    }

    fun actualizar(id: UUID, r: EstanteRequest): EstanteResponse {
        val e = buscar(id)
        val codigo = r.codigo.trim().uppercase()
        if (e.codigo != codigo && repo.existsByCodigo(codigo)) {
            throw CodigoDuplicadoException("Ya existe un estante con el código '$codigo'")
        }
        e.codigo = codigo
        e.descripcion = r.descripcion?.trim()?.ifBlank { null }
        e.ubicacionFisica = r.ubicacionFisica?.trim()?.ifBlank { null }
        return repo.save(e).toResponse()
    }

    fun cambiarEstado(id: UUID, activo: Boolean) = buscar(id).apply { this.activo = activo }.let { repo.save(it).toResponse() }

    fun buscar(id: UUID): Estante = repo.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Estante no encontrado con id: $id") }
}
