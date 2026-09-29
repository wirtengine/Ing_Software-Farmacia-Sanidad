package com.farmacia.sanidad.caja

import com.farmacia.sanidad.auth.entity.Usuario
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/caja")
@Tag(name = "Caja")
class CajaController(private val service: CajaService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun listar() = service.listarTodas()

    @GetMapping("/actual") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    @Operation(summary = "Caja abierta actualmente (una por farmacia)")
    fun actual() = service.obtenerCajaActual()

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping("/abrir") @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Abrir caja (la base de datos exige rol ADMIN)")
    fun abrir(@Valid @RequestBody r: AbrirCajaRequest, @AuthenticationPrincipal usuario: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.abrir(r, usuario))

    @PatchMapping("/{id}/cerrar") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun cerrar(@PathVariable id: UUID, @Valid @RequestBody r: CerrarCajaRequest, @AuthenticationPrincipal usuario: Usuario) =
        service.cerrar(id, r, usuario)
}
