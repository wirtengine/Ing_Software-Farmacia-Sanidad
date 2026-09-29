package com.farmacia.sanidad.auth.security

import com.farmacia.sanidad.auth.repository.UsuarioRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter

/** No es @Component para que no se registre dos veces como filtro del servlet. */
class JwtAuthenticationFilter(
    private val jwtUtil: JwtUtil,
    private val usuarioRepository: UsuarioRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain) {
        val header = req.getHeader("Authorization")
        if (header != null && header.startsWith("Bearer ") && SecurityContextHolder.getContext().authentication == null) {
            val claims = jwtUtil.claimsValidos(header.substring(7))
            val username = claims?.subject
            if (username != null) {
                val usuario = usuarioRepository.findByNombreUsuario(username)
                if (usuario != null && usuario.activo) {
                    val auth = UsernamePasswordAuthenticationToken(usuario, null, usuario.authorities)
                    auth.details = WebAuthenticationDetailsSource().buildDetails(req)
                    SecurityContextHolder.getContext().authentication = auth
                }
            }
        }
        chain.doFilter(req, res)
    }
}
