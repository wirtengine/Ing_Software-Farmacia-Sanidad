package com.farmacia.sanidad.alerta

import com.farmacia.sanidad.common.db.FarmaciaDb
import com.farmacia.sanidad.common.exception.RecursoNoEncontradoException
import com.farmacia.sanidad.lote.Lote
import com.farmacia.sanidad.producto.Producto
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.persistence.*
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

enum class TipoAlerta { STOCK_CRITICO, VENCIMIENTO_PROXIMO }

@Entity
@Table(name = "alertas", schema = "farmacia")
class Alerta {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false) var producto: Producto? = null
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lote_id") var lote: Lote? = null
    @Enumerated(EnumType.STRING) @Column(name = "tipo", nullable = false) var tipo: TipoAlerta = TipoAlerta.STOCK_CRITICO
    @Column(name = "mensaje", nullable = false, columnDefinition = "text") var mensaje: String = ""
    @Column(name = "activa", nullable = false) var activa: Boolean = true
    @Column(name = "fecha_generacion", insertable = false, updatable = false) var fechaGeneracion: LocalDateTime? = null
    @Column(name = "fecha_resolucion") var fechaResolucion: LocalDateTime? = null
}

interface AlertaRepository : JpaRepository<Alerta, UUID> {
    @Query("select a from Alerta a where a.activa = true order by a.fechaGeneracion desc")
    fun activas(): List<Alerta>

    @Query("select a from Alerta a where a.activa = true and a.tipo = :tipo order by a.fechaGeneracion desc")
    fun activasPorTipo(@Param("tipo") tipo: TipoAlerta): List<Alerta>

    @Query("select a from Alerta a where a.producto.id = :productoId order by a.fechaGeneracion desc")
    fun porProducto(@Param("productoId") productoId: UUID): List<Alerta>
}

data class AlertaResponse(
    val id: UUID, val productoId: UUID, val productoNombre: String, val loteId: UUID?, val numeroLote: String?,
    val tipo: TipoAlerta, val mensaje: String?, val activa: Boolean,
    val fechaGeneracion: LocalDateTime?, val fechaResolucion: LocalDateTime?
)

fun Alerta.toResponse() = AlertaResponse(
    id!!, producto!!.id!!, producto!!.nombreComercial, lote?.id, lote?.numeroLote,
    tipo, mensaje, activa, fechaGeneracion, fechaResolucion
)

@Service
@Transactional
class AlertaService(private val repo: AlertaRepository, private val db: FarmaciaDb) {
    private val log = LoggerFactory.getLogger(AlertaService::class.java)

    @Transactional(readOnly = true) fun activas() = repo.activas().map { it.toResponse() }
    @Transactional(readOnly = true) fun porTipo(tipo: TipoAlerta) = repo.activasPorTipo(tipo).map { it.toResponse() }
    @Transactional(readOnly = true) fun porProducto(id: UUID) = repo.porProducto(id).map { it.toResponse() }

    fun resolver(id: UUID): AlertaResponse {
        val a = repo.findById(id).orElseThrow { RecursoNoEncontradoException("Alerta no encontrada con id: $id") }
        a.activa = false
        a.fechaResolucion = LocalDateTime.now()
        return repo.save(a).toResponse()
    }

    fun generar(): Int = db.generarAlertas().also { log.info("Alertas generadas/actualizadas: {}", it) }
}

@Component
class AlertaScheduler(private val service: AlertaService) {
    private val log = LoggerFactory.getLogger(AlertaScheduler::class.java)

    @Scheduled(cron = "0 0 * * * *")
    fun ejecutar() {
        try { service.generar() } catch (ex: Exception) { log.error("Error en scheduler de alertas: {}", ex.message) }
    }
}

@RestController
@RequestMapping("/alertas")
@Tag(name = "Alertas")
class AlertaController(private val service: AlertaService) {
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun activas() = service.activas()
    @GetMapping("/tipo/{tipo}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun porTipo(@PathVariable tipo: TipoAlerta) = service.porTipo(tipo)
    @GetMapping("/producto/{productoId}") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun porProducto(@PathVariable productoId: UUID) = service.porProducto(productoId)
    @PatchMapping("/{id}/resolver") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')") fun resolver(@PathVariable id: UUID) = service.resolver(id)
    @PostMapping("/generar") @PreAuthorize("hasRole('ADMIN')") fun generar() = mapOf("alertasGeneradas" to service.generar())
}
