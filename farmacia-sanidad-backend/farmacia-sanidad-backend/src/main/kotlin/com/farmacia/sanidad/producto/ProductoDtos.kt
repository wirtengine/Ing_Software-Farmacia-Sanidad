package com.farmacia.sanidad.producto

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.Hibernate
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class MedicamentoRequest(
    @field:NotBlank(message = "El código interno es obligatorio") @field:Size(max = 60) val codigoInterno: String = "",
    @field:NotBlank(message = "Un medicamento requiere código sanitario") @field:Size(max = 80) val codigoSanitario: String = "",
    @field:NotBlank(message = "Un medicamento requiere nombre genérico") @field:Size(max = 180) val nombreGenerico: String = "",
    @field:NotBlank(message = "El nombre comercial es obligatorio") @field:Size(max = 180) val nombreComercial: String = "",
    @field:NotBlank(message = "Un medicamento requiere presentación") @field:Size(max = 120) val presentacion: String = "",
    @field:Size(max = 100) val categoria: String? = null,
    val requiereReceta: Boolean = false,
    @field:NotNull @field:DecimalMin("0.0") val precioVenta: BigDecimal? = null,
    @field:Min(0) val stockMinimo: Int? = null,
    @field:Min(0) val stockMaximo: Int? = null,
    val imagenUrl: String? = null,
    val estanteId: UUID? = null,
    @field:NotNull(message = "La unidad base es obligatoria") val unidadBase: UnidadMedida? = null
)

data class ProductoGeneralRequest(
    @field:NotBlank(message = "El código interno es obligatorio") @field:Size(max = 60) val codigoInterno: String = "",
    @field:Size(max = 180) val nombreGenerico: String? = null,
    @field:NotBlank(message = "El nombre es obligatorio") @field:Size(max = 180) val nombreComercial: String = "",
    @field:Size(max = 120) val presentacion: String? = null,
    @field:Size(max = 100) val categoria: String? = null,
    @field:NotNull @field:DecimalMin("0.0") val precioVenta: BigDecimal? = null,
    @field:Min(0) val stockMinimo: Int? = null,
    @field:Min(0) val stockMaximo: Int? = null,
    val imagenUrl: String? = null,
    val estanteId: UUID? = null,
    @field:NotNull(message = "La unidad base es obligatoria") val unidadBase: UnidadMedida? = null
)

data class ProductoUnidadRequest(
    @field:NotNull(message = "La unidad es obligatoria") val unidad: UnidadMedida? = null,
    @field:Min(value = 1, message = "El factor base debe ser al menos 1") val factorBase: Int = 1,
    val esUnidadBase: Boolean = false,
    @field:Size(max = 80) val codigoBarras: String? = null,
    @field:NotNull(message = "El precio es obligatorio") @field:DecimalMin("0.0") val precioVenta: BigDecimal? = null
)

data class AsignarEstanteRequest(@field:NotNull val estanteId: UUID? = null)

data class ProductoUnidadResponse(
    val id: UUID,
    val productoId: UUID,
    val unidad: UnidadMedida,
    val factorBase: Int,
    val esUnidadBase: Boolean,
    val codigoBarras: String?,
    val precioVenta: BigDecimal,
    val activo: Boolean
)

data class ProductoResponse(
    val id: UUID,
    val codigoInterno: String,
    val codigoSanitario: String?,
    val nombreGenerico: String?,
    val nombreComercial: String,
    val presentacion: String?,
    val categoria: String?,
    val tipoProducto: TipoProducto,
    val requiereReceta: Boolean,
    val precioVenta: BigDecimal,
    val stockMinimo: Int?,
    val stockMaximo: Int?,
    val imagenUrl: String?,
    val estanteId: UUID?,
    val estanteCodigo: String?,
    val unidadBase: UnidadMedida?,
    val activo: Boolean,
    val unidades: List<ProductoUnidadResponse>,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)

data class ProductoBusquedaResponse(
    val id: UUID,
    val codigoInterno: String,
    val codigoSanitario: String?,
    val nombreComercial: String,
    val nombreGenerico: String?,
    val tipoProducto: TipoProducto,
    val precioVenta: BigDecimal,
    val requiereReceta: Boolean,
    val estanteCodigo: String?,
    val activo: Boolean
)

fun ProductoUnidad.toResponse() = ProductoUnidadResponse(
    id!!, producto!!.id!!, unidad, factorBase, esUnidadBase, codigoBarras, precioVenta, activo
)

fun Producto.real(): Producto = Hibernate.unproxy(this) as Producto

fun Producto.toResponse(): ProductoResponse {
    val p = real()
    return ProductoResponse(
        id = p.id!!, codigoInterno = p.codigoInterno, codigoSanitario = p.codigoSanitario,
        nombreGenerico = p.nombreGenerico, nombreComercial = p.nombreComercial,
        presentacion = p.presentacion, categoria = p.categoria, tipoProducto = p.tipo(),
        requiereReceta = p.requiereReceta, precioVenta = p.precioVenta,
        stockMinimo = p.stockMinimo, stockMaximo = p.stockMaximo, imagenUrl = p.imagenUrl,
        estanteId = p.estante?.id, estanteCodigo = p.estante?.codigo, unidadBase = p.unidadBase,
        activo = p.activo, unidades = p.unidades.map { it.toResponse() },
        createdAt = p.createdAt, updatedAt = p.updatedAt
    )
}

fun Producto.toBusqueda(): ProductoBusquedaResponse {
    val p = real()
    return ProductoBusquedaResponse(
        p.id!!, p.codigoInterno, p.codigoSanitario, p.nombreComercial, p.nombreGenerico,
        p.tipo(), p.precioVenta, p.requiereReceta, p.estante?.codigo, p.activo
    )
}
