package com.farmacia.sanidad.caja

import com.farmacia.sanidad.auth.entity.Usuario
import jakarta.persistence.*
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotNull
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

enum class EstadoCaja { ABIERTA, CERRADA }

@Entity
@Table(name = "cajas", schema = "farmacia")
class Caja {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_apertura_id", nullable = false)
    var usuarioApertura: Usuario? = null

    @Column(name = "fecha_apertura", insertable = false, updatable = false)
    var fechaApertura: LocalDateTime? = null

    @Column(name = "monto_inicial", nullable = false) var montoInicial: BigDecimal = BigDecimal.ZERO

    @Enumerated(EnumType.STRING) @Column(name = "estado", nullable = false)
    var estado: EstadoCaja = EstadoCaja.ABIERTA

    @Column(name = "fecha_cierre") var fechaCierre: LocalDateTime? = null
    @Column(name = "total_ventas_efectivo") var totalVentasEfectivo: BigDecimal? = null
    @Column(name = "monto_final_teorico") var montoFinalTeorico: BigDecimal? = null
    @Column(name = "monto_final_real") var montoFinalReal: BigDecimal? = null
    @Column(name = "diferencia") var diferencia: BigDecimal? = null

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_cierre_id")
    var usuarioCierre: Usuario? = null
}

interface CajaRepository : JpaRepository<Caja, UUID> {
    fun findFirstByEstadoOrderByFechaAperturaDesc(estado: EstadoCaja): Caja?

    @Query("select c from Caja c order by c.fechaApertura desc")
    fun recientes(): List<Caja>

    @Query(
        "select coalesce(sum(v.total), 0) from Venta v where v.caja.id = :cajaId " +
            "and v.estado = com.farmacia.sanidad.venta.EstadoVenta.COMPLETADA"
    )
    fun totalVentas(@Param("cajaId") cajaId: UUID): BigDecimal
}

data class AbrirCajaRequest(@field:NotNull @field:DecimalMin("0.0") val montoInicial: BigDecimal? = null)
data class CerrarCajaRequest(@field:NotNull @field:DecimalMin("0.0") val montoFinalReal: BigDecimal? = null)

data class CajaResponse(
    val id: UUID,
    val usuarioAperturaId: UUID,
    val usuarioAperturaNombre: String,
    val fechaApertura: LocalDateTime?,
    val montoInicial: BigDecimal,
    val estado: EstadoCaja,
    val fechaCierre: LocalDateTime?,
    val totalVentasEfectivo: BigDecimal?,
    val montoFinalTeorico: BigDecimal?,
    val montoFinalReal: BigDecimal?,
    val diferencia: BigDecimal?,
    val usuarioCierreId: UUID?,
    val usuarioCierreNombre: String?
)
