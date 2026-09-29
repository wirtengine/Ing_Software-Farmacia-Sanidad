package com.farmacia.sanidad.movimiento

import com.farmacia.sanidad.auth.entity.Usuario
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/movimientos")
@Tag(name = "Movimientos de inventario")
class MovimientoController(private val service: MovimientoService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun listar() = service.listarTodos()

    @GetMapping("/producto/{productoId}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun porProducto(@PathVariable productoId: UUID) = service.listarPorProducto(productoId)

    @PostMapping("/ajuste") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun ajuste(@Valid @RequestBody r: AjusteInventarioRequest, @AuthenticationPrincipal usuario: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrarAjuste(r, usuario))
}

@RestController
@RequestMapping("/dispensaciones")
@Tag(name = "Dispensaciones")
class DispensacionController(private val service: DispensacionService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun listar() = service.listarTodas()

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping @PreAuthorize("hasRole('REGENTE')")
    fun registrar(@Valid @RequestBody r: DispensacionRequest, @AuthenticationPrincipal usuario: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(r, usuario))
}
