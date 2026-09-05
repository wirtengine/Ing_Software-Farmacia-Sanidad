// src/main/kotlin/com/farmacia/sanidad/FarmaciaSanidadApplication.kt
package com.farmacia.sanidad

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FarmaciaSanidadApplication

fun main(args: Array<String>) {
    runApplication<FarmaciaSanidadApplication>(*args)
}