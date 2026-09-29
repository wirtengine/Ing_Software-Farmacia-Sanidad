package com.farmacia.sanidad.qr

import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.ValidacionException
import com.farmacia.sanidad.producto.ProductoUnidadRepository
import com.farmacia.sanidad.producto.ProductoService
import com.farmacia.sanidad.producto.UnidadMedida
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.client.j2se.MatrixToImageWriter
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.io.ByteArrayOutputStream
import java.util.UUID

data class QrProductoInfo(val unidadId: UUID, val unidad: UnidadMedida, val codigoBarras: String?, val contenido: String)

@Service
class QrService {
    fun generarPng(contenido: String, lado: Int = 300): ByteArray {
        if (contenido.isBlank()) throw ValidacionException("El contenido del QR no puede estar vacío")
        val tam = lado.coerceIn(100, 1000)
        val hints = mapOf(EncodeHintType.ERROR_CORRECTION to ErrorCorrectionLevel.H, EncodeHintType.MARGIN to 1)
        val matriz = QRCodeWriter().encode(contenido, BarcodeFormat.QR_CODE, tam, tam, hints)
        return ByteArrayOutputStream().use { MatrixToImageWriter.writeToStream(matriz, "PNG", it); it.toByteArray() }
    }
}

@RestController
@RequestMapping("/qr")
@Tag(name = "Códigos QR")
class QrController(
    private val qrService: QrService,
    private val productoService: ProductoService,
    private val unidadRepository: ProductoUnidadRepository
) {
    /** Público: se usa en <img src>. Solo contiene el código de la unidad. */
    @GetMapping("/producto/{productoId}/unidad/{unidadId}", produces = [MediaType.IMAGE_PNG_VALUE])
    @Transactional(readOnly = true)
    fun qrUnidad(@PathVariable productoId: UUID, @PathVariable unidadId: UUID): ResponseEntity<ByteArray> {
        val u = unidadRepository.findById(unidadId).orElseThrow { RecursoNoEncontradoException("Unidad no encontrada") }
        if (u.producto?.id != productoId) throw RecursoNoEncontradoException("La unidad no pertenece al producto")
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)
            .body(qrService.generarPng(u.codigoBarras ?: "PROD:$productoId|UNI:$unidadId"))
    }

    @GetMapping("/producto/{productoId}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE','VENDEDOR')")
    @Transactional(readOnly = true)
    fun infoProducto(@PathVariable productoId: UUID): List<QrProductoInfo> {
        productoService.buscar(productoId)
        return unidadRepository.findByProductoIdOrderByFactorBase(productoId).map {
            QrProductoInfo(it.id!!, it.unidad, it.codigoBarras, it.codigoBarras ?: "PROD:$productoId|UNI:${it.id}")
        }
    }

    @GetMapping("/custom", produces = [MediaType.IMAGE_PNG_VALUE]) @PreAuthorize("hasRole('ADMIN')")
    fun custom(@RequestParam contenido: String, @RequestParam(defaultValue = "300") lado: Int) =
        ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrService.generarPng(contenido, lado))
}
