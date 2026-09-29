package com.farmacia.sanidad.auth.security

import com.farmacia.sanidad.auth.repository.UsuarioRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val userDetailsService: CustomUserDetailsService,
    private val jwtUtil: JwtUtil,
    private val usuarioRepository: UsuarioRepository,
    private val corsConfigurationSource: CorsConfigurationSource
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(): AuthenticationManager {
        val provider = DaoAuthenticationProvider()
        provider.setUserDetailsService(userDetailsService)
        provider.setPasswordEncoder(passwordEncoder())
        return ProviderManager(provider)
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers(
                        "/auth/login", "/auth/register", "/info",
                        "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/error"
                    ).permitAll()
                    // El QR se usa como <img src>, que no envía el header Authorization
                    .requestMatchers(HttpMethod.GET, "/qr/producto/*/unidad/*").permitAll()
                    .anyRequest().authenticated()
            }
            .exceptionHandling {
                it.authenticationEntryPoint { req, res, _ ->
                    res.status = 401
                    res.contentType = MediaType.APPLICATION_JSON_VALUE
                    res.characterEncoding = "UTF-8"
                    res.writer.write(
                        """{"status":401,"error":"Unauthorized","mensaje":"Debe iniciar sesión","ruta":"${req.requestURI}"}"""
                    )
                }
            }
            .addFilterBefore(JwtAuthenticationFilter(jwtUtil, usuarioRepository), UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}
