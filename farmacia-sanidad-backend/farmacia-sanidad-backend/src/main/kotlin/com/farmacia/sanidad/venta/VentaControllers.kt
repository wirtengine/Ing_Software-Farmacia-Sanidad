package com.farmacia.sanidad.venta

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
@RequestMapping("/ventas")
@Tag(name = "Ventas")
class VentaController(private val service: VentaService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun listar() = service.listarTodas()

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @GetMapping("/{id}/comprobante") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun comprobante(@PathVariable id: UUID) = service.obtenerComprobante(id)

    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    @Operation(summary = "Registrar venta (descuenta en unidad base con FEFO)")
    fun crear(@Valid @RequestBody r: VentaRequest, @AuthenticationPrincipal usuario: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r, usuario))

    @PatchMapping("/{id}/anular") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    @Operation(summary = "Anular venta (solo el mismo día)")
    fun anular(@PathVariable id: UUID, @Valid @RequestBody r: AnularVentaRequest, @AuthenticationPrincipal usuario: Usuario) =
        service.anular(id, r, usuario)
}

@RestController
@RequestMapping("/clientes")
@Tag(name = "Clientes")
class ClienteController(private val service: VentaService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun listar() = service.listarClientes()

    @GetMapping("/buscar") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun buscar(@RequestParam texto: String) = service.buscarClientes(texto)

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun obtener(@PathVariable id: UUID) = service.obtenerCliente(id)

    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun crear(@Valid @RequestBody r: ClienteRequest) = ResponseEntity.status(HttpStatus.CREATED).body(service.crearCliente(r))

    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun actualizar(@PathVariable id: UUID, @Valid @RequestBody r: ClienteRequest) = service.actualizarCliente(id, r)
}
