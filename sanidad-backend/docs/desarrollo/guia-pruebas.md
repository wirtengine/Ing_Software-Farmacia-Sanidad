# Guía de Pruebas

## Tipos de pruebas
- **Unitarias**: Usar JUnit 5 y Mockito. Probar servicios y mappers.
- **Integración**: Usar \@SpringBootTest\ y base de datos en memoria (H2) o Supabase de prueba.
- **End-to-end**: Probar flujos completos con TestRestTemplate o MockMvc.

## Estructura
- Los tests van en \src/test/kotlin/\ con la misma estructura de paquetes que el código fuente.
- Nombrar los tests con sufijo \Test\ (ej. \AuthServiceTest\).

## Ejemplo de prueba unitaria
\\\kotlin
@ExtendWith(MockitoExtension::class)
class AuthServiceTest {
    @Mock
    lateinit var usuarioRepository: UsuarioRepository

    @InjectMocks
    lateinit var authService: AuthService

    @Test
    fun egister should throw when username already exists() {
        // given
        val request = RegisterRequest("admin", "Admin", "pass", RolUsuario.ADMIN)
        whenever(usuarioRepository.existsByUsername("admin")).thenReturn(true)

        // when / then
        assertThrows<IllegalArgumentException> {
            authService.register(request)
        }
    }
}
\\\

## Cobertura
- Idealmente >80% de cobertura en servicios críticos.
- Usar \./gradlew test jacocoTestReport\ para generar reporte.
