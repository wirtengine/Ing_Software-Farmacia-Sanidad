package com.farmacia.sanidad.common.exception

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.dao.DataAccessException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.multipart.MaxUploadSizeExceededException
import org.springframework.web.multipart.support.MissingServletRequestPartException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(RecursoNoEncontradoException::class)
    fun noEncontrado(ex: RuntimeException, req: HttpServletRequest) = r(HttpStatus.NOT_FOUND, ex.message, req)

    @ExceptionHandler(CodigoDuplicadoException::class, StockInsuficienteException::class, EstadoInvalidoException::class)
    fun conflicto(ex: RuntimeException, req: HttpServletRequest) = r(HttpStatus.CONFLICT, ex.message, req)

    @ExceptionHandler(
        ValidacionException::class, BusinessRuleException::class, UnidadInvalidaException::class,
        FraccionamientoInvalidoException::class, StorageException::class
    )
    fun badRequest(ex: RuntimeException, req: HttpServletRequest) = r(HttpStatus.BAD_REQUEST, ex.message, req)

    @ExceptionHandler(BadCredentialsException::class)
    fun credenciales(ex: BadCredentialsException, req: HttpServletRequest) =
        r(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos", req)

    @ExceptionHandler(DisabledException::class)
    fun deshabilitado(ex: DisabledException, req: HttpServletRequest) =
        r(HttpStatus.UNAUTHORIZED, "El usuario está desactivado", req)

    @ExceptionHandler(AccessDeniedException::class)
    fun denegado(ex: AccessDeniedException, req: HttpServletRequest) =
        r(HttpStatus.FORBIDDEN, "No tiene permisos para realizar esta acción", req)

    @ExceptionHandler(MaxUploadSizeExceededException::class)
    fun archivoGrande(ex: MaxUploadSizeExceededException, req: HttpServletRequest) =
        r(HttpStatus.BAD_REQUEST, "La imagen no puede superar los 5 MB", req)

    @ExceptionHandler(MissingServletRequestPartException::class, MissingServletRequestParameterException::class)
    fun faltaParametro(ex: Exception, req: HttpServletRequest) =
        r(HttpStatus.BAD_REQUEST, "Falta un parámetro obligatorio: ${ex.message}", req)

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun tipoInvalido(ex: MethodArgumentTypeMismatchException, req: HttpServletRequest) =
        r(HttpStatus.BAD_REQUEST, "Valor inválido para '${ex.name}'", req)

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun jsonInvalido(ex: HttpMessageNotReadableException, req: HttpServletRequest) =
        r(HttpStatus.BAD_REQUEST, "El cuerpo de la petición es inválido o le faltan campos obligatorios", req)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun validacion(ex: MethodArgumentNotValidException, req: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val detalles = ex.bindingResult.fieldErrors.map { "${it.field}: ${it.defaultMessage}" }
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                status = 400, error = "Bad Request",
                mensaje = "Error de validación en los datos enviados",
                ruta = req.requestURI, detalles = detalles
            )
        )
    }

    /** Errores lanzados por las funciones/triggers de PostgreSQL (RAISE EXCEPTION). */
    @ExceptionHandler(DataAccessException::class)
    fun baseDatos(ex: DataAccessException, req: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val mensaje = mensajePostgres(ex)
        log.warn("Error de base de datos: {}", mensaje)
        val status = if (ex is DataIntegrityViolationException) HttpStatus.CONFLICT else HttpStatus.BAD_REQUEST
        return r(status, mensaje, req)
    }

    @ExceptionHandler(Exception::class)
    fun generico(ex: Exception, req: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val causaPg = generateSequence<Throwable>(ex) { it.cause }
            .firstOrNull { it.javaClass.name == "org.postgresql.util.PSQLException" }
        if (causaPg != null) return r(HttpStatus.BAD_REQUEST, limpiar(causaPg.message), req)
        log.error("Error no controlado", ex)
        return r(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error interno en el servidor", req)
    }

    private fun mensajePostgres(ex: Throwable): String {
        val raiz = generateSequence(ex) { it.cause }.last()
        return limpiar(raiz.message)
    }

    private fun limpiar(msg: String?): String {
        if (msg.isNullOrBlank()) return "Error en la operación"
        return msg.removePrefix("ERROR: ").substringBefore("\n").substringBefore("  Where:").trim()
    }

    private fun r(status: HttpStatus, mensaje: String?, req: HttpServletRequest) =
        ResponseEntity.status(status).body(
            ErrorResponse(
                status = status.value(), error = status.reasonPhrase,
                mensaje = mensaje ?: status.reasonPhrase, ruta = req.requestURI
            )
        )
}
