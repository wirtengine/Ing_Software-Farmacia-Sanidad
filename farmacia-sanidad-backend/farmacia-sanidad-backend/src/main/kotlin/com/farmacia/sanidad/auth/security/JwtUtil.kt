package com.farmacia.sanidad.auth.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtUtil(
    @Value("\${jwt.secret}") secret: String,
    @Value("\${jwt.expiration}") val expiration: Long
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.padEnd(32, '0').toByteArray(StandardCharsets.UTF_8))

    fun generarToken(user: UserDetails): String {
        val ahora = Date()
        return Jwts.builder()
            .subject(user.username)
            .claim("authorities", user.authorities.joinToString(",") { it.authority })
            .issuedAt(ahora)
            .expiration(Date(ahora.time + expiration))
            .signWith(key)
            .compact()
    }

    fun claimsValidos(token: String): Claims? = try {
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
    } catch (ex: Exception) {
        null
    }
}
