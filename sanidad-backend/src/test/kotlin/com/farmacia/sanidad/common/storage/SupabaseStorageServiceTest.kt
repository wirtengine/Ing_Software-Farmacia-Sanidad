package com.farmacia.sanidad.common.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.farmacia.sanidad.common.exception.StorageException
import okhttp3.OkHttpClient
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockMultipartFile

class SupabaseStorageServiceTest {

    private lateinit var server: MockWebServer
    private lateinit var service: SupabaseStorageService

    @BeforeEach
    fun setUp() {
        server = MockWebServer()
        server.start()
        service = SupabaseStorageService(
            okHttpClient = OkHttpClient(),
            objectMapper = ObjectMapper(),
            supabaseUrl = server.url("").toString().removeSuffix("/"),
            serviceKey = "clave-de-prueba",
            bucket = "productos",
            maxFileSize = 5L * 1024 * 1024
        )
    }

    @AfterEach
    fun tearDown() = server.shutdown()

    @Test
    fun `sube una imagen valida y devuelve la URL publica`() {
        server.enqueue(MockResponse().setResponseCode(200).setBody("{}"))
        val archivo = MockMultipartFile("archivo", "foto.jpg", "image/jpeg", "contenido".toByteArray())

        val url = service.subirImagen(archivo, "productos/abc")

        assertTrue(url.contains("/storage/v1/object/public/productos/productos/abc/"))
        assertTrue(url.endsWith(".jpg"))
        val request = server.takeRequest()
        assertEquals("POST", request.method)
        assertEquals("Bearer clave-de-prueba", request.getHeader("Authorization"))
    }

    @Test
    fun `rechaza archivos mayores a 5 MB`() {
        val archivo = MockMultipartFile("archivo", "foto.jpg", "image/jpeg", ByteArray(6 * 1024 * 1024))
        val ex = assertThrows(StorageException::class.java) { service.subirImagen(archivo, "productos/abc") }
        assertEquals("La imagen no puede superar los 5 MB", ex.message)
    }

    @Test
    fun `rechaza formatos no permitidos`() {
        val archivo = MockMultipartFile("archivo", "doc.pdf", "application/pdf", "x".toByteArray())
        val ex = assertThrows(StorageException::class.java) { service.subirImagen(archivo, "productos/abc") }
        assertEquals("Formato no soportado. Usá JPG, PNG o WebP", ex.message)
    }
}
