package com.farmacia.sanidad.auth.dto

import com.farmacia.sanidad.auth.entity.RolUsuario

data class RegisterRequest(
    val username: String,
    val nombreCompleto: String,
    val password: String,
    val rol: RolUsuario
)