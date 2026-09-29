package com.farmacia.sanidad.estante

import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/estantes")
@Tag(name = "Estantes")
class EstanteController(private val service: EstanteService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun listar() = service.listarTodos()

    @GetMapping("/activos") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun activos() = service.listarActivos()

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    fun crear(@Valid @RequestBody r: EstanteRequest) = ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r))

    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    fun actualizar(@PathVariable id: UUID, @Valid @RequestBody r: EstanteRequest) = service.actualizar(id, r)

    @PatchMapping("/{id}/desactivar") @PreAuthorize("hasRole('ADMIN')")
    fun desactivar(@PathVariable id: UUID) = service.cambiarEstado(id, false)

    @PatchMapping("/{id}/activar") @PreAuthorize("hasRole('ADMIN')")
    fun activar(@PathVariable id: UUID) = service.cambiarEstado(id, true)
}
