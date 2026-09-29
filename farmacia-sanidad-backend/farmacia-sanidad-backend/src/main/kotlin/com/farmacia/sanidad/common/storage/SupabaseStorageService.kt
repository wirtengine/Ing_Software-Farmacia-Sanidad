package com.farmacia.sanidad.common.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.farmacia.sanidad.common.exception.StorageException
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class SupabaseStorageService(
    private val okHttpClient: OkHttpClient,
    private val objectMapper: ObjectMapper,
    @Value("\${supabase.url}") private val supabaseUrl: String,
    @Value("\${supabase.service-key}") private val serviceKey: String,
    @Value("\${supabase.bucket}") private val bucket: String,
    @Value("\${supabase.max-file-size}") private val maxFileSize: Long
) {
    private val log = LoggerFactory.getLogger(SupabaseStorageService::class.java)

    private val extensionesPorMime = mapOf(
        "image/jpeg" to "jpg",
        "image/png" to "png",
        "image/webp" to "webp"
    )

    fun subirImagen(archivo: MultipartFile, carpeta: String): String {
        if (archivo.isEmpty) throw StorageException("El archivo está vacío")
        if (archivo.size > maxFileSize) throw StorageException("La imagen no puede superar los 5 MB")

        val mime = archivo.contentType?.lowercase()
        val extension = extensionesPorMime[mime]
            ?: throw StorageException("Formato no soportado. Usá JPG, PNG o WebP")

        if (serviceKey.isBlank()) {
            log.error("SUPABASE_SERVICE_KEY no está configurada")
            throw StorageException("El almacenamiento de imágenes no está configurado en el servidor")
        }

        val path = "$carpeta/${UUID.randomUUID()}.$extension"
        val request = Request.Builder()
            .url("$supabaseUrl/storage/v1/object/$bucket/$path")
            .header("Authorization", "Bearer $serviceKey")
            .header("apikey", serviceKey)
            .header("x-upsert", "true")
            .post(archivo.bytes.toRequestBody(mime!!.toMediaTypeOrNull()))
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    val detalle = extraerMensajeError(response.body?.string().orEmpty())
                    log.warn("Supabase Storage rechazó la subida. status={} detalle={}", response.code, detalle)
                    throw StorageException("Error al subir la imagen. Intentá de nuevo")
                }
            }
        } catch (ex: StorageException) {
            throw ex
        } catch (ex: Exception) {
            log.error("Error de red al subir imagen a Supabase Storage: {}", ex.message)
            throw StorageException("Error al subir la imagen. Intentá de nuevo")
        }

        log.info("Imagen subida a Supabase Storage: {}", path)
        return "$supabaseUrl/storage/v1/object/public/$bucket/$path"
    }

    /** Best-effort: nunca lanza excepción. */
    fun eliminarImagen(url: String) {
        try {
            val marcador = "/storage/v1/object/public/$bucket/"
            if (!url.startsWith(supabaseUrl) || !url.contains(marcador) || serviceKey.isBlank()) return
            val path = url.substringAfter(marcador)
            val request = Request.Builder()
                .url("$supabaseUrl/storage/v1/object/$bucket/$path")
                .header("Authorization", "Bearer $serviceKey")
                .header("apikey", serviceKey)
                .delete()
                .build()
            okHttpClient.newCall(request).execute().use { response ->
                if (response.isSuccessful) log.info("Imagen anterior eliminada: {}", path)
                else log.warn("No se pudo eliminar la imagen anterior. status={}", response.code)
            }
        } catch (ex: Exception) {
            log.warn("Error al eliminar imagen anterior (ignorado): {}", ex.message)
        }
    }

    private fun extraerMensajeError(body: String): String = try {
        val nodo = objectMapper.readTree(body)
        nodo.get("message")?.asText() ?: nodo.get("error")?.asText() ?: "sin detalle"
    } catch (ex: Exception) {
        "sin detalle"
    }
}
