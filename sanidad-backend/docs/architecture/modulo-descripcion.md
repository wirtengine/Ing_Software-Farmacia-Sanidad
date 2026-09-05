# Descripción de Módulos

## auth
- **Responsabilidad**: Autenticación, registro y gestión de usuarios (roles).
- **Componentes**: Login, Register, JWT, SecurityConfig.
- **Entidades**: Usuario.
- **Roles**: ADMIN, REGENTE, VENDEDOR.

## medicamento
- **Responsabilidad**: Catálogo de medicamentos y productos generales.
- **Operaciones**: CRUD de productos, clasificación (MEDICAMENTO/GENERAL), validación de código sanitario.
- **Entidades**: Producto.

## proveedor
- **Responsabilidad**: Gestión de proveedores.
- **Operaciones**: CRUD de proveedores.
- **Entidades**: Proveedor.

## lote
- **Responsabilidad**: Gestión de lotes de compra.
- **Operaciones**: Registro de lotes, consulta por FEFO, actualización de estado.
- **Entidades**: Lote.

## inventario
- **Responsabilidad**: Movimientos de stock (entradas, salidas, ajustes).
- **Operaciones**: Aplicar FEFO, registrar entradas de compra, registrar salidas por venta o dispensación, ajustes físicos.
- **Entidades**: MovimientoInventario.
- **Reglas**: No permitir salidas sin stock suficiente.

## ventas
- **Responsabilidad**: Proceso de venta al cliente.
- **Operaciones**: Registrar venta, calcular total/vuelto, emitir comprobante, abrir/cerrar caja.
- **Entidades**: Venta, DetalleVenta, Caja.
- **Reglas**: Ventas atómicas con descuento de stock.

## clientes
- **Responsabilidad**: Registro y búsqueda de clientes.
- **Operaciones**: CRUD, búsqueda por nombre/identificación.

## recetas
- **Responsabilidad**: Dispensación de medicamentos con receta.
- **Operaciones**: Registrar receta, dispensar con lote, trazabilidad del regente.
- **Entidades**: Receta, Dispensacion, DetalleDispensacion.

## devoluciones
- **Responsabilidad**: Devoluciones de clientes y a proveedores.
- **Operaciones**: Registrar devolución, estado cuarentena, acta de devolución.
- **Entidades**: Devolucion, DetalleDevolucion.
- **Reglas**: Motivos válidos, autorización REGENTE/ADMIN.

## alertas
- **Responsabilidad**: Generación de alertas de stock crítico y vencimientos.
- **Operaciones**: Evaluación periódica, consulta de alertas activas.

## recomendaciones
- **Responsabilidad**: Generación de recomendaciones de compra, liquidación, descontinuación.
- **Operaciones**: Cálculo de ventas diarias, cobertura, umbrales (15 días, 4 unidades en 60 días).

## dashboard
- **Responsabilidad**: Panel resumen de indicadores.
- **Operaciones**: Consulta de stock total, productos críticos, recomendaciones activas.

## reportes
- **Responsabilidad**: Generación de reportes de stock, movimientos, vencimientos.
- **Operaciones**: Filtros por fecha, tipo, producto.

## auditoria
- **Responsabilidad**: Registro automático de cambios en tablas.
- **Operaciones**: Log de eventos (creación, modificación, eliminación).

## common
- **Responsabilidad**: Configuraciones, excepciones y utilidades compartidas.
