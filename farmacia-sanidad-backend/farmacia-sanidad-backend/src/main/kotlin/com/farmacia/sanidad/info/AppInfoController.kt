package com.farmacia.sanidad.info

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/info")
@Tag(name = "Info")
class AppInfoController {
    @GetMapping
    fun info() = mapOf(
        "aplicacion" to "Farmacia Sanidad Backend",
        "descripcion" to "Sistema Web para el Control de Ventas e Inventario con Alertas Automáticas",
        "pais" to "Nicaragua",
        "version" to "1.0.0",
        "java" to System.getProperty("java.version")
    )
}
