package com.farmacia.sanidad.proveedor

import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/proveedores")
@Tag(name = "Proveedores")
class ProveedorController(private val service: ProveedorService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun listar() = service.listarTodos()

    @GetMapping("/activos") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun activos() = service.listarActivos()

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    fun crear(@Valid @RequestBody r: ProveedorRequest) = ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r))

    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    fun actualizar(@PathVariable id: UUID, @Valid @RequestBody r: ProveedorRequest) = service.actualizar(id, r)

    @PatchMapping("/{id}/desactivar") @PreAuthorize("hasRole('ADMIN')")
    fun desactivar(@PathVariable id: UUID) = service.cambiarEstado(id, false)

    @PatchMapping("/{id}/activar") @PreAuthorize("hasRole('ADMIN')")
    fun activar(@PathVariable id: UUID) = service.cambiarEstado(id, true)
}
