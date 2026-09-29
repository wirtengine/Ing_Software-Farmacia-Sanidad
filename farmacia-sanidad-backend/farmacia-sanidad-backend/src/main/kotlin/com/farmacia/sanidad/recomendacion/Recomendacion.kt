package com.farmacia.sanidad.recomendacion

import com.farmacia.sanidad.auth.entity.Usuario
import com.farmacia.sanidad.auth.repository.UsuarioRepository
import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.EstadoInvalidoException
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.common.exception.ValidacionException
import com.farmacia.sanidad.producto.Producto
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.persistence.*
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

enum class TipoRecomendacion { COMPRA, LIQUIDACION, DESCONTINUACION }
enum class EstadoRecomendacion { ACTIVA, GESTIONADA, DESCARTADA }

@Entity
@Table(name = "recomendaciones", schema = "farmacia")
class Recomendacion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false) var producto: Producto? = null
    @Enumerated(EnumType.STRING) @Column(name = "tipo", nullable = false) var tipo: TipoRecomendacion = TipoRecomendacion.COMPRA
    @Enumerated(EnumType.STRING) @Column(name = "estado", nullable = false) var estado: EstadoRecomendacion = EstadoRecomendacion.ACTIVA
    @Column(name = "venta_diaria_promedio") var ventaDiariaPromedio: BigDecimal? = null
    @Column(name = "cobertura_dias") var coberturaDias: BigDecimal? = null
    @Column(name = "unidades_vendidas_60d") var unidadesVendidas60d: Int? = null
    @Column(name = "dias_con_movimiento_60d") var diasConMovimiento60d: Int? = null
    @Column(name = "motivo", nullable = false, columnDefinition = "text") var motivo: String = ""
    @Column(name = "fecha_generacion", insertable = false, updatable = false) var fechaGeneracion: LocalDateTime? = null
    @Column(name = "fecha_gestion") var fechaGestion: LocalDateTime? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_gestion_id") var usuarioGestion: Usuario? = null
}

interface RecomendacionRepository : JpaRepository<Recomendacion, UUID> {
    @Query("select r from Recomendacion r where r.estado = :estado order by r.fechaGeneracion desc")
    fun porEstado(@Param("estado") estado: EstadoRecomendacion): List<Recomendacion>

    @Query("select r from Recomendacion r where r.estado = :estado and r.tipo = :tipo order by r.fechaGeneracion desc")
    fun porTipoYEstado(@Param("tipo") tipo: TipoRecomendacion, @Param("estado") estado: EstadoRecomendacion): List<Recomendacion>

    @Query("select r from Recomendacion r where r.producto.id = :productoId order by r.fechaGeneracion desc")
    fun porProducto(@Param("productoId") productoId: UUID): List<Recomendacion>
}

data class GestionarRecomendacionRequest(@field:NotNull val estado: EstadoRecomendacion? = null)

data class RecomendacionResponse(
    val id: UUID, val productoId: UUID, val productoNombre: String,
    val tipo: TipoRecomendacion, val estado: EstadoRecomendacion,
    val ventaDiariaPromedio: BigDecimal?, val coberturaDias: BigDecimal?,
    val unidadesVendidas60d: Int?, val diasConMovimiento60d: Int?, val motivo: String?,
    val fechaGeneracion: LocalDateTime?, val fechaGestion: LocalDateTime?,
    val usuarioGestionId: UUID?, val usuarioGestionNombre: String?
)

fun Recomendacion.toResponse() = RecomendacionResponse(
    id!!, producto!!.id!!, producto!!.nombreComercial, tipo, estado, ventaDiariaPromedio, coberturaDias,
    unidadesVendidas60d, diasConMovimiento60d, motivo, fechaGeneracion, fechaGestion,
    usuarioGestion?.id, usuarioGestion?.nombreCompleto
)

@Service
@Transactional
class RecomendacionService(
    private val repo: RecomendacionRepository,
    private val usuarioRepository: UsuarioRepository,
    private val db: FarmaciaDb
) {
    private val log = LoggerFactory.getLogger(RecomendacionService::class.java)

    @Transactional(readOnly = true) fun activas() = repo.porEstado(EstadoRecomendacion.ACTIVA).map { it.toResponse() }
    @Transactional(readOnly = true) fun porTipo(t: TipoRecomendacion) = repo.porTipoYEstado(t, EstadoRecomendacion.ACTIVA).map { it.toResponse() }
    @Transactional(readOnly = true) fun porProducto(id: UUID) = repo.porProducto(id).map { it.toResponse() }

    fun gestionar(id: UUID, r: GestionarRecomendacionRequest, usuario: Usuario): RecomendacionResponse {
        val rec = repo.findById(id).orElseThrow { RecursoNoEncontradoException("Recomendación no encontrada con id: $id") }
        if (rec.estado != EstadoRecomendacion.ACTIVA) throw EstadoInvalidoException("La recomendación ya fue gestionada o descartada")
        if (r.estado == EstadoRecomendacion.ACTIVA) throw ValidacionException("El nuevo estado debe ser GESTIONADA o DESCARTADA")
        rec.estado = r.estado!!
        rec.fechaGestion = LocalDateTime.now()
        rec.usuarioGestion = usuarioRepository.getReferenceById(usuario.id!!)
        return repo.save(rec).toResponse()
    }

    fun generar(): Int = db.generarRecomendaciones().also { log.info("Recomendaciones generadas: {}", it) }
}

@Component
class RecomendacionScheduler(private val service: RecomendacionService) {
    private val log = LoggerFactory.getLogger(RecomendacionScheduler::class.java)

    @Scheduled(cron = "0 0 2 * * *")
    fun ejecutar() {
        try { service.generar() } catch (ex: Exception) { log.error("Error en scheduler de recomendaciones: {}", ex.message) }
    }
}

@RestController
@RequestMapping("/recomendaciones")
@Tag(name = "Recomendaciones")
class RecomendacionController(private val service: RecomendacionService) {
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun activas() = service.activas()
    @GetMapping("/tipo/{tipo}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun porTipo(@PathVariable tipo: TipoRecomendacion) = service.porTipo(tipo)
    @GetMapping("/producto/{productoId}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun porProducto(@PathVariable productoId: UUID) = service.porProducto(productoId)

    @PatchMapping("/{id}/gestionar") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun gestionar(@PathVariable id: UUID, @Valid @RequestBody r: GestionarRecomendacionRequest, @AuthenticationPrincipal u: Usuario) =
        service.gestionar(id, r, u)

    @PostMapping("/generar") @PreAuthorize("hasRole('ADMIN')")
    fun generar() = mapOf("recomendacionesGeneradas" to service.generar())
}
