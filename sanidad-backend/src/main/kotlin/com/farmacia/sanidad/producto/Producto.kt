package com.farmacia.sanidad.producto

import com.farmacia.sanidad.estante.Estante
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

enum class TipoProducto { MEDICAMENTO, GENERAL }

enum class UnidadMedida { CAJA, BLISTER, TABLETA, FRASCO, AMPOLLA, SOBRE, TUBO, UNIDAD, MILILITRO, GRAMO }

@Entity
@Table(name = "productos", schema = "farmacia")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_producto", discriminatorType = DiscriminatorType.STRING)
abstract class Producto {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(name = "codigo_interno", nullable = false, unique = true)
    var codigoInterno: String = ""

    @Column(name = "codigo_sanitario", unique = true)
    var codigoSanitario: String? = null

    @Column(name = "nombre_generico")
    var nombreGenerico: String? = null

    @Column(name = "nombre_comercial", nullable = false)
    var nombreComercial: String = ""

    @Column(name = "presentacion")
    var presentacion: String? = null

    @Column(name = "categoria")
    var categoria: String? = null

    @Column(name = "requiere_receta", nullable = false)
    var requiereReceta: Boolean = false

    @Column(name = "precio_venta", nullable = false, precision = 12, scale = 2)
    var precioVenta: BigDecimal = BigDecimal.ZERO

    @Column(name = "stock_minimo")
    var stockMinimo: Int? = null

    @Column(name = "stock_maximo")
    var stockMaximo: Int? = null

    @Column(name = "imagen_url", columnDefinition = "text")
    var imagenUrl: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estante_id")
    var estante: Estante? = null

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_base")
    var unidadBase: UnidadMedida? = null

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null

    @OneToMany(mappedBy = "producto", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("factorBase ASC")
    var unidades: MutableList<ProductoUnidad> = mutableListOf()

    abstract fun tipo(): TipoProducto
}

@Entity
@DiscriminatorValue("MEDICAMENTO")
class Medicamento : Producto() {
    override fun tipo() = TipoProducto.MEDICAMENTO
}

@Entity
@DiscriminatorValue("GENERAL")
class ProductoGeneral : Producto() {
    override fun tipo() = TipoProducto.GENERAL
}

@Entity
@Table(name = "producto_unidades", schema = "farmacia")
class ProductoUnidad {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    var producto: Producto? = null

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad", nullable = false)
    var unidad: UnidadMedida = UnidadMedida.UNIDAD

    @Column(name = "factor_base", nullable = false)
    var factorBase: Int = 1

    @Column(name = "es_unidad_base", nullable = false)
    var esUnidadBase: Boolean = false

    @Column(name = "codigo_barras", unique = true, length = 80)
    var codigoBarras: String? = null

    @Column(name = "precio_venta", nullable = false, precision = 12, scale = 2)
    var precioVenta: BigDecimal = BigDecimal.ZERO

    @Column(name = "activo", nullable = false)
    var activo: Boolean = true

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = null

    @UpdateTimestamp @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
}
