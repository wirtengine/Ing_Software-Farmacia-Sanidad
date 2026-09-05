package com.farmacia.sanidad.auth.dto

data class LoginRequest(
    val username: String,
    val password: String
)