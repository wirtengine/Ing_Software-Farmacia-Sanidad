package com.farmacia.sanidad.auth.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtUtil: JwtUtil,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        return false
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            try {
                val username = jwtUtil.extractUsername(token)

                if (username != null && SecurityContextHolder.getContext().authentication == null) {
                    val userDetails = userDetailsService.loadUserByUsername(username)

                    if (jwtUtil.isTokenValid(token, userDetails)) {
                        val rol = jwtUtil.extractRol(token)
                        val authorities = mutableListOf<SimpleGrantedAuthority>()

                        authorities.addAll(userDetails.authorities.map { SimpleGrantedAuthority(it.authority) })

                        if (rol != null) {
                            authorities.add(SimpleGrantedAuthority(rol))
                            authorities.add(SimpleGrantedAuthority("ROLE_$rol"))
                        }

                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities.distinct()
                        )

                        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authToken
                    }
                }
            } catch (e: Exception) {
                logger.error("Error al procesar el token JWT: ${e.message}")
            }
        }

        filterChain.doFilter(request, response)
    }
}