package com.farmacia.sanidad.devolucion

import com.farmacia.sanidad.auth.entity.Usuario
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

/** La BD exige que toda devolución la autorice un ADMIN o REGENTE. */
@RestController
@RequestMapping("/devoluciones")
@Tag(name = "Devoluciones")
class DevolucionController(private val service: DevolucionService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun listar() = service.listarTodas()

    @GetMapping("/tipo/{tipo}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun porTipo(@PathVariable tipo: TipoDevolucion) = service.listarPorTipo(tipo)

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping("/cliente") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun cliente(@Valid @RequestBody r: DevolucionClienteRequest, @AuthenticationPrincipal u: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrarCliente(r, u))

    @PostMapping("/proveedor") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun proveedor(@Valid @RequestBody r: DevolucionProveedorRequest, @AuthenticationPrincipal u: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrarProveedor(r, u))

    @PatchMapping("/{id}/disponer") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun disponer(@PathVariable id: UUID, @Valid @RequestBody r: DisponerDevolucionRequest, @AuthenticationPrincipal u: Usuario) =
        service.disponer(id, r, u)
}
