package com.farmacia.sanidad

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class FarmaciaSanidadBackendApplication

fun main(args: Array<String>) {
    runApplication<FarmaciaSanidadBackendApplication>(*args)
}
