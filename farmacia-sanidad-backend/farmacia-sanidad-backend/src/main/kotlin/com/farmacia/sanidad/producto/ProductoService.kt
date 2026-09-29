package com.farmacia.sanidad.producto

import com.farmacia.sanidad.common.exception.CodigoDuplicadoException
import com.farmacia.sanidad.common.exception.EstadoInvalidoException
import com.farmacia.sanidad.common.exception.FraccionamientoInvalidoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.ValidacionException
import com.farmacia.sanidad.common.storage.SupabaseStorageService
import com.farmacia.sanidad.estante.EstanteService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
@Transactional
class ProductoService(
    private val productoRepository: ProductoRepository,
    private val unidadRepository: ProductoUnidadRepository,
    private val estanteService: EstanteService,
    private val storage: SupabaseStorageService
) {
    private val log = LoggerFactory.getLogger(ProductoService::class.java)

    // ---------------- Consultas ----------------

    @Transactional(readOnly = true)
    fun listarTodos() = productoRepository.findAllByOrderByNombreComercial().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun listarActivos() = productoRepository.findByActivoTrueOrderByNombreComercial().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun obtenerPorId(id: UUID) = buscar(id).toResponse()

    @Transactional(readOnly = true)
    fun buscarTexto(codigo: String): List<ProductoBusquedaResponse> {
        val q = codigo.trim()
        if (q.isEmpty()) return emptyList()
        return productoRepository.buscar(q).map { it.toBusqueda() }
    }

    // ---------------- Creación / actualización ----------------

    fun crearMedicamento(r: MedicamentoRequest): ProductoResponse {
        val codigoInterno = r.codigoInterno.trim()
        val codigoSanitario = r.codigoSanitario.trim()
        if (productoRepository.existsByCodigoInterno(codigoInterno))
            throw CodigoDuplicadoException("El código interno '$codigoInterno' ya existe")
        if (productoRepository.existsByCodigoSanitario(codigoSanitario))
            throw CodigoDuplicadoException("El código sanitario '$codigoSanitario' ya existe")
        validarStock(r.stockMinimo, r.stockMaximo)

        val m = Medicamento().apply {
            this.codigoInterno = codigoInterno
            this.codigoSanitario = codigoSanitario
            nombreGenerico = r.nombreGenerico.trim()
            nombreComercial = r.nombreComercial.trim()
            presentacion = r.presentacion.trim()
            categoria = r.categoria.limpio()
            requiereReceta = r.requiereReceta
            precioVenta = r.precioVenta!!
            stockMinimo = r.stockMinimo
            stockMaximo = r.stockMaximo
            imagenUrl = r.imagenUrl.limpio()
            unidadBase = r.unidadBase
            estante = r.estanteId?.let { estanteService.buscar(it) }
        }
        agregarUnidadBaseInicial(m)
        val guardado = productoRepository.save(m)
        log.info("Medicamento creado: {}", guardado.nombreComercial)
        return guardado.toResponse()
    }

    fun crearProductoGeneral(r: ProductoGeneralRequest): ProductoResponse {
        val codigoInterno = r.codigoInterno.trim()
        if (productoRepository.existsByCodigoInterno(codigoInterno))
            throw CodigoDuplicadoException("El código interno '$codigoInterno' ya existe")
        validarStock(r.stockMinimo, r.stockMaximo)

        val g = ProductoGeneral().apply {
            this.codigoInterno = codigoInterno
            nombreGenerico = r.nombreGenerico.limpio()
            nombreComercial = r.nombreComercial.trim()
            presentacion = r.presentacion.limpio()
            categoria = r.categoria.limpio()
            requiereReceta = false
            precioVenta = r.precioVenta!!
            stockMinimo = r.stockMinimo
            stockMaximo = r.stockMaximo
            imagenUrl = r.imagenUrl.limpio()
            unidadBase = r.unidadBase
            estante = r.estanteId?.let { estanteService.buscar(it) }
        }
        agregarUnidadBaseInicial(g)
        val guardado = productoRepository.save(g)
        log.info("Producto general creado: {}", guardado.nombreComercial)
        return guardado.toResponse()
    }

    fun actualizarMedicamento(id: UUID, r: MedicamentoRequest): ProductoResponse {
        val p = buscar(id).real()
        if (p !is Medicamento) throw EstadoInvalidoException("El producto no es un medicamento")
        validarCodigoInterno(p, r.codigoInterno.trim())
        val sanitario = r.codigoSanitario.trim()
        if (p.codigoSanitario != sanitario && productoRepository.existsByCodigoSanitario(sanitario))
            throw CodigoDuplicadoException("El código sanitario '$sanitario' ya está en uso")
        validarStock(r.stockMinimo, r.stockMaximo)
        p.apply {
            codigoInterno = r.codigoInterno.trim()
            codigoSanitario = sanitario
            nombreGenerico = r.nombreGenerico.trim()
            nombreComercial = r.nombreComercial.trim()
            presentacion = r.presentacion.trim()
            categoria = r.categoria.limpio()
            requiereReceta = r.requiereReceta
            precioVenta = r.precioVenta!!
            stockMinimo = r.stockMinimo
            stockMaximo = r.stockMaximo
            r.imagenUrl.limpio()?.let { imagenUrl = it }
            unidadBase = r.unidadBase
            estante = r.estanteId?.let { estanteService.buscar(it) }
        }
        return productoRepository.save(p).toResponse()
    }

    fun actualizarProductoGeneral(id: UUID, r: ProductoGeneralRequest): ProductoResponse {
        val p = buscar(id).real()
        if (p !is ProductoGeneral) throw EstadoInvalidoException("El producto no es un producto general")
        validarCodigoInterno(p, r.codigoInterno.trim())
        validarStock(r.stockMinimo, r.stockMaximo)
        p.apply {
            codigoInterno = r.codigoInterno.trim()
            nombreGenerico = r.nombreGenerico.limpio()
            nombreComercial = r.nombreComercial.trim()
            presentacion = r.presentacion.limpio()
            categoria = r.categoria.limpio()
            precioVenta = r.precioVenta!!
            stockMinimo = r.stockMinimo
            stockMaximo = r.stockMaximo
            r.imagenUrl.limpio()?.let { imagenUrl = it }
            unidadBase = r.unidadBase
            estante = r.estanteId?.let { estanteService.buscar(it) }
        }
        return productoRepository.save(p).toResponse()
    }

    fun cambiarEstado(id: UUID, activo: Boolean): ProductoResponse {
        val p = buscar(id)
        p.activo = activo
        return productoRepository.save(p).toResponse()
    }

    fun asignarEstante(id: UUID, estanteId: UUID): ProductoResponse {
        val p = buscar(id)
        p.estante = estanteService.buscar(estanteId)
        return productoRepository.save(p).toResponse()
    }

    fun quitarEstante(id: UUID): ProductoResponse {
        val p = buscar(id)
        p.estante = null
        return productoRepository.save(p).toResponse()
    }

    // ---------------- Unidades de venta (fraccionamiento) ----------------

    @Transactional(readOnly = true)
    fun listarUnidades(productoId: UUID): List<ProductoUnidadResponse> {
        buscar(productoId)
        return unidadRepository.findByProductoIdOrderByFactorBase(productoId).map { it.toResponse() }
    }

    fun agregarUnidad(productoId: UUID, r: ProductoUnidadRequest): ProductoUnidadResponse {
        val p = buscar(productoId)
        val codigo = r.codigoBarras.limpio()
        if (codigo != null && unidadRepository.existsByCodigoBarras(codigo))
            throw CodigoDuplicadoException("Ya existe una unidad con el código de barras '$codigo'")
        if (r.esUnidadBase) {
            if (r.factorBase != 1) throw FraccionamientoInvalidoException("La unidad base debe tener factor 1")
            if (p.unidades.any { it.esUnidadBase && it.activo })
                throw FraccionamientoInvalidoException("El producto ya tiene una unidad base definida")
        }
        if (p.unidades.any { it.activo && it.unidad == r.unidad })
            throw FraccionamientoInvalidoException("El producto ya tiene una unidad ${r.unidad} activa")

        val u = ProductoUnidad().apply {
            producto = p
            unidad = r.unidad!!
            factorBase = r.factorBase
            esUnidadBase = r.esUnidadBase
            codigoBarras = codigo
            precioVenta = r.precioVenta!!
        }
        if (r.esUnidadBase) p.unidadBase = r.unidad
        return unidadRepository.save(u).toResponse()
    }

    fun actualizarUnidad(productoId: UUID, unidadId: UUID, r: ProductoUnidadRequest): ProductoUnidadResponse {
        val u = buscarUnidad(productoId, unidadId)
        val codigo = r.codigoBarras.limpio()
        if (codigo != null && codigo != u.codigoBarras && unidadRepository.existsByCodigoBarras(codigo))
            throw CodigoDuplicadoException("Ya existe una unidad con el código de barras '$codigo'")
        if (u.esUnidadBase && r.factorBase != 1)
            throw FraccionamientoInvalidoException("La unidad base debe tener factor 1")
        u.unidad = r.unidad!!
        u.factorBase = r.factorBase
        u.codigoBarras = codigo
        u.precioVenta = r.precioVenta!!
        return unidadRepository.save(u).toResponse()
    }

    fun eliminarUnidad(productoId: UUID, unidadId: UUID) {
        val u = buscarUnidad(productoId, unidadId)
        if (u.esUnidadBase) throw FraccionamientoInvalidoException("No se puede eliminar la unidad base del producto")
        u.activo = false
        unidadRepository.save(u)
    }

    // ---------------- Imagen (Supabase Storage) ----------------

    fun subirImagen(id: UUID, archivo: MultipartFile): ProductoResponse {
        val p = buscar(id)
        val nuevaUrl = storage.subirImagen(archivo, "productos/$id")
        val anterior = p.imagenUrl
        p.imagenUrl = nuevaUrl
        val guardado = productoRepository.save(p)
        if (!anterior.isNullOrBlank() && anterior != nuevaUrl) storage.eliminarImagen(anterior)
        log.info("Imagen actualizada para producto {}", id)
        return guardado.toResponse()
    }

    fun eliminarImagen(id: UUID): ProductoResponse {
        val p = buscar(id)
        val anterior = p.imagenUrl
        p.imagenUrl = null
        val guardado = productoRepository.save(p)
        if (!anterior.isNullOrBlank()) storage.eliminarImagen(anterior)
        return guardado.toResponse()
    }

    // ---------------- Helpers ----------------

    fun buscar(id: UUID): Producto = productoRepository.findById(id)
        .orElseThrow { RecursoNoEncontradoException("Producto no encontrado con id: $id") }

    private fun buscarUnidad(productoId: UUID, unidadId: UUID): ProductoUnidad {
        val u = unidadRepository.findById(unidadId)
            .orElseThrow { RecursoNoEncontradoException("Unidad no encontrada con id: $unidadId") }
        if (u.producto?.id != productoId) throw RecursoNoEncontradoException("La unidad no pertenece al producto indicado")
        return u
    }

    private fun agregarUnidadBaseInicial(p: Producto) {
        p.unidades.add(ProductoUnidad().apply {
            producto = p
            unidad = p.unidadBase ?: UnidadMedida.UNIDAD
            factorBase = 1
            esUnidadBase = true
            precioVenta = p.precioVenta
        })
    }

    private fun validarCodigoInterno(p: Producto, codigo: String) {
        if (p.codigoInterno != codigo && productoRepository.existsByCodigoInterno(codigo))
            throw CodigoDuplicadoException("El código interno '$codigo' ya está en uso")
    }

    private fun validarStock(min: Int?, max: Int?) {
        if (min != null && max != null && min > max)
            throw ValidacionException("El stock mínimo no puede ser mayor que el stock máximo")
    }

    private fun String?.limpio(): String? = this?.trim()?.ifBlank { null }
}
