package com.farmacia.sanidad.dashboard

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.util.UUID

data class EstanteCriticoDto(val estanteId: UUID, val estanteCodigo: String, val cantidadProductosCriticos: Long)

data class VentaDiaDto(val fecha: String, val total: BigDecimal)

data class DashboardResponse(
    val ventasHoy: BigDecimal,
    val ventasMes: BigDecimal,
    val cantidadVentasHoy: Long,
    val productosActivos: Long,
    val productosStockCritico: Long,
    val lotesProximosAVencer: Long,
    val alertasActivas: Long,
    val recomendacionesActivas: Long,
    val topEstantesConProductosCriticos: List<EstanteCriticoDto>,
    val ventasUltimos7Dias: List<VentaDiaDto>
)

@Service
@Transactional(readOnly = true)
class DashboardService(private val jdbc: JdbcTemplate) {

    private fun decimal(sql: String): BigDecimal = jdbc.queryForObject(sql, BigDecimal::class.java) ?: BigDecimal.ZERO
    private fun entero(sql: String): Long = jdbc.queryForObject(sql, Long::class.java) ?: 0L

    fun obtener(): DashboardResponse {
        val criticos = """
            p.activo = true and p.stock_minimo is not null
            and farmacia.fn_stock_producto(p.id) <= p.stock_minimo
        """.trimIndent()

        val top = jdbc.query(
            """
            select e.id, e.codigo, count(p.id) as cantidad
            from farmacia.estantes e
            join farmacia.productos p on p.estante_id = e.id
            where $criticos
            group by e.id, e.codigo
            order by cantidad desc
            limit 5
            """.trimIndent()
        ) { rs, _ -> EstanteCriticoDto(rs.getObject("id", UUID::class.java), rs.getString("codigo"), rs.getLong("cantidad")) }

        val semana = jdbc.query(
            """
            select to_char(d.dia, 'DD/MM') as fecha, coalesce(sum(v.total), 0) as total
            from generate_series(current_date - 6, current_date, interval '1 day') as d(dia)
            left join farmacia.ventas v on v.created_at::date = d.dia::date and v.estado = 'COMPLETADA'
            group by d.dia order by d.dia
            """.trimIndent()
        ) { rs, _ -> VentaDiaDto(rs.getString("fecha"), rs.getBigDecimal("total")) }

        return DashboardResponse(
            ventasHoy = decimal("select coalesce(sum(total),0) from farmacia.ventas where estado='COMPLETADA' and created_at::date = current_date"),
            ventasMes = decimal("select coalesce(sum(total),0) from farmacia.ventas where estado='COMPLETADA' and date_trunc('month', created_at) = date_trunc('month', current_date)"),
            cantidadVentasHoy = entero("select count(*) from farmacia.ventas where estado='COMPLETADA' and created_at::date = current_date"),
            productosActivos = entero("select count(*) from farmacia.productos where activo = true"),
            productosStockCritico = entero("select count(*) from farmacia.productos p where $criticos"),
            lotesProximosAVencer = entero("select count(*) from farmacia.lotes where estado='DISPONIBLE' and cantidad_disponible > 0 and fecha_vencimiento <= current_date + 30"),
            alertasActivas = entero("select count(*) from farmacia.alertas where activa = true"),
            recomendacionesActivas = entero("select count(*) from farmacia.recomendaciones where estado = 'ACTIVA'"),
            topEstantesConProductosCriticos = top,
            ventasUltimos7Dias = semana
        )
    }
}

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard")
class DashboardController(private val service: DashboardService) {
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun obtener() = service.obtener()
}
