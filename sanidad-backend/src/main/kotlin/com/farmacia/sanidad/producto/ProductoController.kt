package com.farmacia.sanidad.producto

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/productos")
@Tag(name = "Productos")
class ProductoController(private val service: ProductoService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun listar() = service.listarTodos()

    @GetMapping("/activos") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun activos() = service.listarActivos()

    @GetMapping("/buscar") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    @Operation(summary = "Buscar por código interno, sanitario, código de barras o nombre")
    fun buscar(@RequestParam codigo: String) = service.buscarTexto(codigo)

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping("/medicamentos") @PreAuthorize("hasRole('ADMIN')")
    fun crearMedicamento(@Valid @RequestBody r: MedicamentoRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.crearMedicamento(r))

    @PostMapping("/generales") @PreAuthorize("hasRole('ADMIN')")
    fun crearGeneral(@Valid @RequestBody r: ProductoGeneralRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.crearProductoGeneral(r))

    @PutMapping("/medicamentos/{id}") @PreAuthorize("hasRole('ADMIN')")
    fun actualizarMedicamento(@PathVariable id: UUID, @Valid @RequestBody r: MedicamentoRequest) =
        service.actualizarMedicamento(id, r)

    @PutMapping("/generales/{id}") @PreAuthorize("hasRole('ADMIN')")
    fun actualizarGeneral(@PathVariable id: UUID, @Valid @RequestBody r: ProductoGeneralRequest) =
        service.actualizarProductoGeneral(id, r)

    @PatchMapping("/{id}/desactivar") @PreAuthorize("hasRole('ADMIN')")
    fun desactivar(@PathVariable id: UUID) = service.cambiarEstado(id, false)

    @PatchMapping("/{id}/activar") @PreAuthorize("hasRole('ADMIN')")
    fun activar(@PathVariable id: UUID) = service.cambiarEstado(id, true)

    @PatchMapping("/{id}/estante") @PreAuthorize("hasRole('ADMIN')")
    fun asignarEstante(@PathVariable id: UUID, @Valid @RequestBody r: AsignarEstanteRequest) =
        service.asignarEstante(id, r.estanteId!!)

    @DeleteMapping("/{id}/estante") @PreAuthorize("hasRole('ADMIN')")
    fun quitarEstante(@PathVariable id: UUID) = service.quitarEstante(id)

    @GetMapping("/{id}/unidades") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun unidades(@PathVariable id: UUID) = service.listarUnidades(id)

    @PostMapping("/{id}/unidades") @PreAuthorize("hasRole('ADMIN')")
    fun agregarUnidad(@PathVariable id: UUID, @Valid @RequestBody r: ProductoUnidadRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.agregarUnidad(id, r))

    @PutMapping("/{id}/unidades/{unidadId}") @PreAuthorize("hasRole('ADMIN')")
    fun actualizarUnidad(@PathVariable id: UUID, @PathVariable unidadId: UUID, @Valid @RequestBody r: ProductoUnidadRequest) =
        service.actualizarUnidad(id, unidadId, r)

    @DeleteMapping("/{id}/unidades/{unidadId}") @PreAuthorize("hasRole('ADMIN')")
    fun eliminarUnidad(@PathVariable id: UUID, @PathVariable unidadId: UUID): ResponseEntity<Void> {
        service.eliminarUnidad(id, unidadId)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/imagen", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Subir imagen del producto a Supabase Storage")
    @ApiResponse(responseCode = "200", description = "Imagen subida y producto actualizado")
    @ApiResponse(responseCode = "400", description = "Archivo inválido, formato no soportado o mayor a 5 MB")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    fun subirImagen(@PathVariable id: UUID, @RequestPart("archivo") archivo: MultipartFile) =
        service.subirImagen(id, archivo)

    @DeleteMapping("/{id}/imagen") @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quitar la imagen del producto")
    fun eliminarImagen(@PathVariable id: UUID) = service.eliminarImagen(id)
}
