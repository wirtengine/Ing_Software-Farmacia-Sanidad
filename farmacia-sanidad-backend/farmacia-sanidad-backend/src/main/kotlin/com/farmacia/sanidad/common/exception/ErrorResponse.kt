package com.farmacia.sanidad.common.exception

import java.time.LocalDateTime

data class ErrorResponse(
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val status: Int,
    val error: String,
    val mensaje: String,
    val ruta: String,
    val detalles: List<String>? = null
)
