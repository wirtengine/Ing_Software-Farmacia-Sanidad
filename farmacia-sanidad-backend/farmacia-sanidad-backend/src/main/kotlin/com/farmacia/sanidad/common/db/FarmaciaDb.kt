package com.farmacia.sanidad.common.db

import com.farmacia.sanidad.common.exception.ValidacionException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.sql.Date
import java.time.LocalDate
import java.util.UUID

data class AsignacionLote(val loteId: UUID, val cantidad: Int)

/**
 * Acceso directo a las funciones PostgreSQL del schema farmacia.
 * Usa la misma transacción que JPA (JpaTransactionManager).
 */
@Component
class FarmaciaDb(private val jdbc: JdbcTemplate) {

    fun stockProducto(productoId: UUID): Int =
        jdbc.queryForObject("select farmacia.fn_stock_producto(?)", Int::class.java, productoId) ?: 0

    fun registrarEntradaLote(
        productoId: UUID, proveedorId: UUID?, numeroLote: String,
        fechaFabricacion: LocalDate?, fechaVencimiento: LocalDate?, cantidad: Int, usuarioId: UUID
    ): UUID = jdbc.queryForObject(
        "select farmacia.fn_registrar_entrada_lote(?, ?, ?, ?, ?, ?, ?)",
        UUID::class.java,
        productoId, proveedorId, numeroLote,
        fechaFabricacion?.let { Date.valueOf(it) }, fechaVencimiento?.let { Date.valueOf(it) },
        cantidad, usuarioId
    )!!

    /** tipo: SALIDA_VENTA | DISPENSACION_RECETA | ANULACION_VENTA (restricción de la función). */
    fun registrarSalidaFefo(
        productoId: UUID, cantidadBase: Int, usuarioId: UUID, tipo: String,
        referenciaTipo: String?, referenciaId: UUID?, motivo: String?
    ): Int = jdbc.queryForObject(
        "select farmacia.fn_registrar_salida_fefo(?, ?, ?, ?, ?, ?, ?)",
        Int::class.java,
        productoId, cantidadBase, usuarioId, tipo, referenciaTipo, referenciaId, motivo
    ) ?: 0

    fun seleccionarLotesFefo(productoId: UUID, cantidad: Int): List<AsignacionLote> = jdbc.query(
        "select lote_id, cantidad_a_descontar from farmacia.fn_seleccionar_lotes_fefo(?, ?)",
        { rs, _ -> AsignacionLote(rs.getObject("lote_id", UUID::class.java), rs.getInt("cantidad_a_descontar")) },
        productoId, cantidad
    )

    fun abrirCaja(usuarioId: UUID, montoInicial: BigDecimal): UUID =
        jdbc.queryForObject("select farmacia.fn_abrir_caja(?, ?)", UUID::class.java, usuarioId, montoInicial)!!

    fun cerrarCaja(cajaId: UUID, usuarioId: UUID, montoFinalReal: BigDecimal) {
        jdbc.queryForList("select id from farmacia.fn_cerrar_caja(?, ?, ?)", cajaId, usuarioId, montoFinalReal)
    }

    fun anularVenta(ventaId: UUID, usuarioSolicitaId: UUID, usuarioAutorizaId: UUID, motivo: String) {
        jdbc.queryForList(
            "select id from farmacia.fn_anular_venta(?, ?, ?, ?)",
            ventaId, usuarioSolicitaId, usuarioAutorizaId, motivo
        )
    }

    fun generarAlertas(): Int = jdbc.queryForObject("select farmacia.fn_generar_alertas()", Int::class.java) ?: 0

    fun generarRecomendaciones(): Int =
        jdbc.queryForObject("select farmacia.fn_generar_recomendaciones()", Int::class.java) ?: 0

    /** Movimientos de salida generados para una referencia (para anulaciones y dispensaciones). */
    fun salidasPorReferencia(tipo: String, referenciaTipo: String, referenciaId: UUID, productoId: UUID? = null) =
        jdbc.query(
            """
            select producto_id, lote_id, cantidad from farmacia.movimientos_inventario
            where tipo = ? and referencia_tipo = ? and referencia_id = ?
              and (?::uuid is null or producto_id = ?::uuid)
            """.trimIndent(),
            { rs, _ ->
                Triple(
                    rs.getObject("producto_id", UUID::class.java),
                    rs.getObject("lote_id", UUID::class.java),
                    rs.getInt("cantidad")
                )
            },
            tipo, referenciaTipo, referenciaId, productoId, productoId
        )

    /** Suma (o resta, si delta < 0) stock a un lote y registra el movimiento correspondiente. */
    fun ajustarLote(
        productoId: UUID, loteId: UUID, delta: Int, usuarioId: UUID, tipo: String,
        referenciaTipo: String?, referenciaId: UUID?, motivo: String?
    ) {
        require(delta != 0)
        val anterior = stockProducto(productoId)
        val filas = jdbc.update(
            """
            update farmacia.lotes
               set cantidad_disponible = cantidad_disponible + ?,
                   estado = case
                       when fecha_vencimiento is not null and fecha_vencimiento <= current_date then 'VENCIDO'
                       when cantidad_disponible + ? = 0 then 'AGOTADO'
                       else 'DISPONIBLE'
                   end,
                   updated_at = now()
             where id = ? and producto_id = ?
            """.trimIndent(),
            delta, delta, loteId, productoId
        )
        if (filas == 0) throw ValidacionException("El lote no pertenece al producto")
        val posterior = stockProducto(productoId)
        jdbc.update(
            """
            insert into farmacia.movimientos_inventario
                (producto_id, lote_id, usuario_id, tipo, cantidad, cantidad_base,
                 referencia_tipo, referencia_id, stock_anterior, stock_posterior, motivo)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            productoId, loteId, usuarioId, tipo, Math.abs(delta), Math.abs(delta),
            referenciaTipo, referenciaId, anterior, posterior, motivo
        )
    }
}