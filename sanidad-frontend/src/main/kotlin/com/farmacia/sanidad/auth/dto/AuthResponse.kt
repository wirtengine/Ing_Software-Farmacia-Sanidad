package com.farmacia.sanidad.auth.dto

data class AuthResponse(
    val token: String,
    val username: String,
    val rol: String
)