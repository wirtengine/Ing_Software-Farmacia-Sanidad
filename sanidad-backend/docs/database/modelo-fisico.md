# Modelo Físico de Base de Datos

## Esquema
- **Esquema**: \armacia\

## Enums
- \ol_usuario\: ADMIN, REGENTE, VENDEDOR
- \	ipo_producto\: MEDICAMENTO, GENERAL
- \	ipo_movimiento\: ENTRADA_COMPRA, SALIDA_VENTA, DISPENSACION_RECETA, AJUSTE_ENTRADA, AJUSTE_SALIDA, DEVOLUCION_PROVEEDOR, DEVOLUCION_CLIENTE_REINGRESO, ANULACION_VENTA
- \estado_lote\: DISPONIBLE, VENCIDO, CUARENTENA, EN_TRANSITO_PROVEEDOR, AGOTADO
- \estado_venta\: ABIERTA, COMPLETADA, ANULADA
- \	ipo_pago\: EFECTIVO
- \estado_caja\: ABIERTA, CERRADA
- \	ipo_alerta\: STOCK_CRITICO, VENCIMIENTO_PROXIMO
- \	ipo_recomendacion\: COMPRA, LIQUIDACION, DESCONTINUACION
- \estado_recomendacion\: ACTIVA, GESTIONADA, DESCARTADA
- \	ipo_devolucion\: CLIENTE, PROVEEDOR
- \motivo_devolucion\: ERROR_DESPACHO, DEFECTO_FABRICA, VENCIDO, PROXIMO_VENCER, DEFECTO_CALIDAD_EMPAQUE, DISCREPANCIA_PEDIDO
- \estado_devolucion\: REGISTRADA, CUARENTENA, EN_TRANSITO, DISPUESTA, RECHAZADA

## Tablas principales
- \usuarios\: Almacena credenciales y roles.
- \productos\: Catálogo de medicamentos y productos generales.
- \proveedores\: Datos de proveedores.
- \lotes\: Lotes de compra con fechas y stock.
- \clientes\: Datos de clientes.
- \cajas\: Apertura y cierre de caja.
- \entas\: Cabecera de ventas.
- \detalles_venta\: Productos vendidos en cada venta.
- \ecetas\: Recetas médicas.
- \dispensaciones\: Dispensaciones asociadas a recetas.
- \detalles_dispensacion\: Productos dispensados.
- \movimientos_inventario\: Historial de movimientos de stock.
- \devoluciones\: Cabecera de devoluciones.
- \detalles_devolucion\: Productos devueltos.
- \lertas\: Alertas generadas automáticamente.
- \ecomendaciones\: Recomendaciones generadas automáticamente.
- \uditoria\: Log de auditoría.

## Vistas y funciones
- \w_stock_actual\: Stock disponible por producto.
- \w_lotes_fefo\: Lotes ordenados por fecha de vencimiento.
- \w_alertas_activas\: Alertas no resueltas.
- \w_recomendaciones_activas\: Recomendaciones activas.
- \w_dashboard_gerencial\: Indicadores resumen.
- \w_historial_movimientos\: Movimientos con datos enriquecidos.
- \w_historial_ventas\: Ventas con datos de cliente y usuario.
- \n_seleccionar_lotes_fefo\: Selecciona lotes para salida.
- \n_registrar_salida_fefo\: Ejecuta salida con FEFO.
- \n_generar_alertas\: Genera alertas periódicas.
- \n_generar_recomendaciones\: Genera recomendaciones periódicas.
