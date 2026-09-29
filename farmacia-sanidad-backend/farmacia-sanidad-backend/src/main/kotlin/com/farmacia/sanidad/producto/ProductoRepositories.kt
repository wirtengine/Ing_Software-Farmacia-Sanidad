package com.farmacia.sanidad.producto

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface ProductoRepository : JpaRepository<Producto, UUID> {
    fun existsByCodigoInterno(codigoInterno: String): Boolean
    fun existsByCodigoSanitario(codigoSanitario: String): Boolean
    fun findAllByOrderByNombreComercial(): List<Producto>
    fun findByActivoTrueOrderByNombreComercial(): List<Producto>

    @Query(
        """
        select distinct p from Producto p
        where p.activo = true and (
            lower(p.codigoInterno) like lower(concat('%', :q, '%'))
            or lower(coalesce(p.codigoSanitario, '')) like lower(concat('%', :q, '%'))
            or lower(p.nombreComercial) like lower(concat('%', :q, '%'))
            or lower(coalesce(p.nombreGenerico, '')) like lower(concat('%', :q, '%'))
            or exists (select u.id from ProductoUnidad u where u.producto = p and u.codigoBarras = :q)
        )
        order by p.nombreComercial
        """
    )
    fun buscar(@Param("q") q: String): List<Producto>
}

interface ProductoUnidadRepository : JpaRepository<ProductoUnidad, UUID> {
    fun existsByCodigoBarras(codigoBarras: String): Boolean
    fun findByProductoIdOrderByFactorBase(productoId: UUID): List<ProductoUnidad>
    fun findByCodigoBarras(codigoBarras: String): ProductoUnidad?
}
