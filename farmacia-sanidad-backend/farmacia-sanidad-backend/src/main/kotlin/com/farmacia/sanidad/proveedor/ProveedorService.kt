package com.farmacia.sanidad.proveedor

import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class ProveedorService(private val repo: ProveedorRepository) {

    @Transactional(readOnly = true) fun listarTodos() = repo.findAllByOrderByRazonSocial().map { it.toResponse() }
    @Transactional(readOnly = true) fun listarActivos() = repo.findByActivoTrueOrderByRazonSocial().map { it.toResponse() }
    @Transactional(readOnly = true) fun obtenerPorId(id: UUID) = buscar(id).toResponse()

    fun crear(r: ProveedorRequest): ProveedorResponse {
        val ruc = r.ruc.trim()
        if (repo.existsByRuc(ruc)) throw CodigoDuplicadoException("Ya existe un proveedor con el RUC '$ruc'")
        return repo.save(Proveedor().also { aplicar(it, r) }).toResponse()
    }

    fun actualizar(id: UUID, r: ProveedorRequest): ProveedorResponse {
        val p = buscar(id)
        val ruc = r.ruc.trim()
        if (p.ruc != ruc && repo.existsByRuc(ruc)) throw CodigoDuplicadoException("Ya existe un proveedor con el RUC '$ruc'")
        aplicar(p, r)
        return repo.save(p).toResponse()
    }

    fun cambiarEstado(id: UUID, activo: Boolean) = buscar(id).apply { this.activo = activo }.let { repo.save(it).toResponse() }

    fun buscar(id: UUID): Proveedor = repo.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Proveedor no encontrado con id: $id") }

    private fun aplicar(p: Proveedor, r: ProveedorRequest) {
        p.ruc = r.ruc.trim()
        p.razonSocial = r.razonSocial.trim()
        p.telefono = r.telefono?.trim()?.ifBlank { null }
        p.correoElectronico = r.correoElectronico?.trim()?.ifBlank { null }
    }
}
