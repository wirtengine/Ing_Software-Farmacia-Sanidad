package com.farmacia.sanidad.auth.dto

import com.farmacia.sanidad.auth.entity.RolUsuario

data class UserDto(
    val id: String,
    val username: String,
    val nombreCompleto: String,
    val rol: RolUsuario,
    val activo: Boolean
)