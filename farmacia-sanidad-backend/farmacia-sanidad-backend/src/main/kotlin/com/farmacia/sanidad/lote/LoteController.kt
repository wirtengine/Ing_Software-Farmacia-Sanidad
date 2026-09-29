package com.farmacia.sanidad.lote

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
@RequestMapping("/lotes")
@Tag(name = "Lotes")
class LoteController(private val service: LoteService) {

    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun listar() = service.listarTodos()

    @GetMapping("/producto/{productoId}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    fun porProducto(@PathVariable productoId: UUID) = service.listarPorProducto(productoId)

    @GetMapping("/proximos-a-vencer") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun proximos(@RequestParam(defaultValue = "30") dias: Long) = service.proximosAVencer(dias)

    @GetMapping("/fefo") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    @Operation(summary = "Vista previa de qué lotes se descontarían (FEFO)")
    fun fefo(@RequestParam productoId: UUID, @RequestParam cantidadRequerida: Int) =
        service.previewFefo(productoId, cantidadRequerida)

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun obtener(@PathVariable id: UUID) = service.obtenerPorId(id)

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar entrada de lote (solo ADMIN, lo exige la base de datos)")
    fun registrar(@Valid @RequestBody r: RegistrarLoteRequest, @AuthenticationPrincipal usuario: Usuario) =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrarEntrada(r, usuario))
}
