// src/main/kotlin/com/farmacia/sanidad/auth/security/JwtUtil.kt
package com.farmacia.sanidad.auth.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.Date

@Component
class JwtUtil(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {

    private val key = Keys.hmacShaKeyFor(secret.toByteArray())

    /**
     * Genera un token JWT para el nombre de usuario y su rol.
     */
    fun generateToken(username: String, rol: String): String {
        return Jwts.builder()
            .subject(username)
            .claim("rol", rol)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiration))
            .signWith(key)
            .compact()
    }

    /**
     * Extrae el rol del token.
     */
    fun extractRol(token: String): String? {
        return extractAllClaims(token).get("rol", String::class.java)
    }

    fun extractUsername(token: String): String {
        return extractAllClaims(token).subject
    }

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return username == userDetails.username && !isTokenExpired(token)
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    private fun isTokenExpired(token: String): Boolean {
        return extractAllClaims(token).expiration.before(Date())
    }
}