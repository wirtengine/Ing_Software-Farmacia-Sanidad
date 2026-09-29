package com.farmacia.sanidad.reporte

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.nio.charset.StandardCharsets
import java.sql.Date
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class ReporteStockDto(
    val productoId: UUID, val codigoInterno: String, val nombreComercial: String, val estanteCodigo: String?,
    val stockActual: Int, val stockMinimo: Int?, val stockMaximo: Int?
)

data class ReporteVentaDto(
    val ventaId: UUID, val numeroComprobante: Long?, val fecha: LocalDateTime?, val vendedor: String,
    val cliente: String?, val total: BigDecimal, val estado: String
)

@Service
@Transactional(readOnly = true)
class ReporteService(private val jdbc: JdbcTemplate) {

    fun stock(): List<ReporteStockDto> = jdbc.query(
        """
        select p.id, p.codigo_interno, p.nombre_comercial, e.codigo as estante,
               farmacia.fn_stock_producto(p.id) as stock, p.stock_minimo, p.stock_maximo
        from farmacia.productos p
        left join farmacia.estantes e on e.id = p.estante_id
        where p.activo = true
        order by p.nombre_comercial
        """.trimIndent()
    ) { rs, _ ->
        ReporteStockDto(
            rs.getObject("id", UUID::class.java), rs.getString("codigo_interno"), rs.getString("nombre_comercial"),
            rs.getString("estante"), rs.getInt("stock"),
            rs.getObject("stock_minimo") as Int?, rs.getObject("stock_maximo") as Int?
        )
    }

    fun ventas(desde: LocalDate, hasta: LocalDate): List<ReporteVentaDto> = jdbc.query(
        """
        select v.id, v.numero_comprobante, v.created_at, u.nombre_completo, c.nombre, v.total, v.estado::text as estado
        from farmacia.ventas v
        join farmacia.usuarios u on u.id = v.usuario_vendedor_id
        left join farmacia.clientes c on c.id = v.cliente_id
        where v.created_at::date between ? and ?
        order by v.created_at desc
        """.trimIndent(),
        { rs, _ ->
            ReporteVentaDto(
                rs.getObject("id", UUID::class.java), rs.getLong("numero_comprobante"),
                rs.getTimestamp("created_at")?.toLocalDateTime(), rs.getString("nombre_completo"),
                rs.getString("nombre"), rs.getBigDecimal("total"), rs.getString("estado")
            )
        },
        Date.valueOf(desde), Date.valueOf(hasta)
    )

    fun stockCsv() = csv(
        listOf("codigo_interno", "nombre_comercial", "estante", "stock_actual", "stock_minimo", "stock_maximo"),
        stock().map { listOf(it.codigoInterno, it.nombreComercial, it.estanteCodigo, it.stockActual, it.stockMinimo, it.stockMaximo) }
    )

    fun ventasCsv(desde: LocalDate, hasta: LocalDate) = csv(
        listOf("numero_comprobante", "fecha", "vendedor", "cliente", "total", "estado"),
        ventas(desde, hasta).map { listOf(it.numeroComprobante, it.fecha, it.vendedor, it.cliente, it.total, it.estado) }
    )

    fun movimientosCsv() = csvDeConsulta(
        """
        select m.created_at as fecha, p.nombre_comercial as producto, l.numero_lote as lote, m.tipo::text as tipo,
               m.cantidad, m.stock_anterior, m.stock_posterior, u.nombre_completo as usuario, m.motivo
        from farmacia.movimientos_inventario m
        join farmacia.productos p on p.id = m.producto_id
        left join farmacia.lotes l on l.id = m.lote_id
        join farmacia.usuarios u on u.id = m.usuario_id
        order by m.created_at desc
        """.trimIndent()
    )

    fun alertasCsv() = csvDeConsulta(
        """
        select a.fecha_generacion, p.nombre_comercial as producto, a.tipo::text as tipo, a.mensaje
        from farmacia.alertas a join farmacia.productos p on p.id = a.producto_id
        where a.activa = true order by a.fecha_generacion desc
        """.trimIndent()
    )

    fun recomendacionesCsv() = csvDeConsulta(
        """
        select r.fecha_generacion, p.nombre_comercial as producto, r.tipo::text as tipo,
               r.cobertura_dias, r.unidades_vendidas_60d, r.motivo
        from farmacia.recomendaciones r join farmacia.productos p on p.id = r.producto_id
        where r.estado = 'ACTIVA' order by r.fecha_generacion desc
        """.trimIndent()
    )

    private fun csvDeConsulta(sql: String): String {
        val filas = jdbc.queryForList(sql)
        if (filas.isEmpty()) return "\uFEFFsin datos\n"
        return csv(filas.first().keys.toList(), filas.map { it.values.toList() })
    }

    private fun csv(encabezados: List<String>, filas: List<List<Any?>>): String {
        fun celda(v: Any?): String {
            val s = v?.toString() ?: ""
            return if (s.contains(',') || s.contains('"') || s.contains('\n')) "\"" + s.replace("\"", "\"\"") + "\"" else s
        }
        val sb = StringBuilder("\uFEFF") // BOM para que Excel respete las tildes
        sb.append(encabezados.joinToString(",")).append('\n')
        filas.forEach { f -> sb.append(f.joinToString(",") { celda(it) }).append('\n') }
        return sb.toString()
    }
}

@RestController
@RequestMapping("/reportes")
@Tag(name = "Reportes")
class ReporteController(private val service: ReporteService) {

    @GetMapping("/stock") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun stock() = service.stock()

    @GetMapping("/ventas") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun ventas(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) fechaInicio: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) fechaFin: LocalDate
    ) = service.ventas(fechaInicio, fechaFin)

    @GetMapping("/stock/csv") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun stockCsv() = csv(service.stockCsv(), "reporte_stock.csv")

    @GetMapping("/ventas/csv") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun ventasCsv(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) fechaInicio: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) fechaFin: LocalDate
    ) = csv(service.ventasCsv(fechaInicio, fechaFin), "reporte_ventas.csv")

    @GetMapping("/movimientos/csv") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun movimientosCsv() = csv(service.movimientosCsv(), "reporte_movimientos.csv")

    @GetMapping("/alertas/csv") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun alertasCsv() = csv(service.alertasCsv(), "reporte_alertas.csv")

    @GetMapping("/recomendaciones/csv") @PreAuthorize("hasAnyRole('ADMIN','REGENTE')")
    fun recomendacionesCsv() = csv(service.recomendacionesCsv(), "reporte_recomendaciones.csv")

    private fun csv(contenido: String, nombre: String): ResponseEntity<ByteArray> =
        ResponseEntity.ok()
            .contentType(MediaType("text", "csv", StandardCharsets.UTF_8))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=$nombre")
            .body(contenido.toByteArray(StandardCharsets.UTF_8))
}
