// src/main/kotlin/com/farmacia/sanidad/FarmaciaSanidadApplication.kt
package com.farmacia.sanidad

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity

@SpringBootApplication
@EnableMethodSecurity
class FarmaciaSanidadApplication

fun main(args: Array<String>) {
    runApplication<FarmaciaSanidadApplication>(*args)
}