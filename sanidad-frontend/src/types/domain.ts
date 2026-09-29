export type Rol = 'ADMIN' | 'REGENTE' | 'VENDEDOR'
export type TipoProducto = 'MEDICAMENTO' | 'GENERAL'
export type UnidadMedida =
  | 'CAJA' | 'BLISTER' | 'TABLETA' | 'FRASCO' | 'AMPOLLA'
  | 'SOBRE' | 'TUBO' | 'UNIDAD' | 'MILILITRO' | 'GRAMO'

export interface UserDto {
  id: string
  username: string
  nombreCompleto: string
  rol: Rol
  activo: boolean
  ultimoAcceso?: string
}

export interface AuthResponse {
  token: string
  tipo: string
  expiraEn: number
  usuario: UserDto
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  nombreCompleto: string
  password: string
  rol: Rol
}

export interface Estante {
  id: string
  codigo: string
  descripcion?: string
  ubicacionFisica?: string
  activo: boolean
}

export interface ProductoUnidad {
  id: string
  productoId: string
  unidad: UnidadMedida
  factorBase: number
  esUnidadBase: boolean
  codigoBarras?: string
  precioVenta: number
  activo: boolean
}

export interface Producto {
  id: string
  tipoProducto: TipoProducto
  codigoInterno: string
  codigoSanitario?: string
  nombreComercial: string
  nombreGenerico?: string
  presentacion?: string
  categoria?: string
  requiereReceta?: boolean
  precioVenta: number
  stockMinimo?: number
  stockMaximo?: number
  imagenUrl?: string
  estanteId?: string
  estanteCodigo?: string
  unidadBase?: UnidadMedida
  activo: boolean
  unidades?: ProductoUnidad[]
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  mensaje: string
  ruta: string
  detalles?: string[]
}

export interface Proveedor {
  id: string
  ruc: string
  razonSocial: string
  telefono?: string
  correoElectronico?: string
  activo: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProveedorRequest {
  ruc: string
  razonSocial: string
  telefono?: string
  correoElectronico?: string
}

export interface EstanteRequest {
  codigo: string
  descripcion?: string
  ubicacionFisica?: string
}

export interface ProductoUnidadRequest {
  unidad: UnidadMedida
  factorBase: number
  esUnidadBase: boolean
  codigoBarras?: string
  precioVenta: number
}

export interface MedicamentoRequest {
  codigoInterno: string
  codigoSanitario?: string
  nombreGenerico?: string
  nombreComercial: string
  presentacion?: string
  categoria?: string
  requiereReceta: boolean
  precioVenta: number
  stockMinimo: number
  stockMaximo: number
  imagenUrl?: string
  estanteId?: string
  unidadBase: UnidadMedida
}

export interface ProductoGeneralRequest {
  codigoInterno: string
  nombreGenerico?: string
  nombreComercial: string
  presentacion?: string
  categoria?: string
  precioVenta: number
  stockMinimo: number
  stockMaximo: number
  imagenUrl?: string
  estanteId?: string
  unidadBase: UnidadMedida
}

export interface ProductoBusqueda {
  id: string
  codigoInterno: string
  codigoSanitario?: string
  nombreComercial: string
  nombreGenerico?: string
  tipoProducto: TipoProducto
  precioVenta: number
  requiereReceta: boolean
  estanteCodigo?: string
  activo: boolean
}

export type EstadoLote = 'DISPONIBLE' | 'VENCIDO' | 'CUARENTENA' | 'EN_TRANSITO_PROVEEDOR' | 'AGOTADO'
export type TipoMovimiento =
  | 'ENTRADA_COMPRA' | 'SALIDA_VENTA' | 'DISPENSACION_RECETA' | 'AJUSTE_ENTRADA'
  | 'AJUSTE_SALIDA' | 'DEVOLUCION_PROVEEDOR' | 'DEVOLUCION_CLIENTE_REINGRESO' | 'ANULACION_VENTA'
export type EstadoVenta = 'ABIERTA' | 'COMPLETADA' | 'ANULADA'
export type EstadoCaja = 'ABIERTA' | 'CERRADA'

export interface Lote {
  id: string
  productoId: string
  productoNombre: string
  proveedorId?: string
  proveedorRazonSocial?: string
  numeroLote: string
  fechaFabricacion?: string
  fechaVencimiento?: string
  cantidadInicial: number
  cantidadDisponible: number
  estado: EstadoLote
  createdAt?: string
  updatedAt?: string
}

export interface RegistrarLoteRequest {
  productoId: string
  proveedorId?: string
  numeroLote: string
  fechaFabricacion?: string
  fechaVencimiento: string
  cantidad: number
}

export interface MovimientoResponse {
  id: string
  productoId: string
  productoNombre: string
  loteId?: string
  numeroLote?: string
  usuarioId: string
  usuarioNombre: string
  tipo: TipoMovimiento
  cantidad: number
  cantidadBase?: number
  referenciaTipo?: string
  referenciaId?: string
  stockAnterior?: number
  stockPosterior?: number
  motivo?: string
  createdAt?: string
}

export interface AjusteInventarioRequest {
  productoId: string
  loteId?: string
  tipo: 'AJUSTE_ENTRADA' | 'AJUSTE_SALIDA'
  cantidadBase: number
  motivo: string
}

export interface Cliente {
  id: string
  nombre: string
  identificacion?: string
  telefono?: string
}

export interface ClienteRequest {
  nombre: string
  identificacion?: string
  telefono?: string
}

export interface DetalleVentaRequest {
  productoId: string
  productoUnidadId: string
  cantidad: number
}

export interface VentaRequest {
  clienteId?: string
  cajaId: string
  montoRecibido: number
  detalles: DetalleVentaRequest[]
}

export interface DetalleVentaResponse {
  id: string
  productoId: string
  productoNombre: string
  loteId?: string
  numeroLote?: string
  productoUnidadId?: string
  cantidad: number
  unidadVendida?: UnidadMedida
  cantidadBase?: number
  precioUnitario: number
  subtotal?: number
}

export interface VentaResponse {
  id: string
  numeroComprobante?: number
  clienteId?: string
  clienteNombre?: string
  usuarioVendedorId: string
  usuarioVendedorNombre: string
  cajaId: string
  estado: EstadoVenta
  tipoPago: string
  subtotal: number
  total: number
  montoRecibido?: number
  vuelto?: number
  motivoAnulacion?: string
  fechaAnulacion?: string
  detalles: DetalleVentaResponse[]
  createdAt?: string
}

export interface ComprobanteResponse {
  ventaId: string
  numeroComprobante?: number
  fecha?: string
  clienteNombre?: string
  vendedorNombre: string
  items: {
    nombreProducto: string
    unidad?: string
    cantidad: number
    precioUnitario: number
    subtotal?: number
  }[]
  subtotal: number
  total: number
  montoRecibido?: number
  vuelto?: number
}

export interface AnularVentaRequest {
  motivo: string
}

export interface Caja {
  id: string
  usuarioAperturaId: string
  usuarioAperturaNombre: string
  fechaApertura?: string
  montoInicial: number
  estado: EstadoCaja
  fechaCierre?: string
  totalVentasEfectivo?: number
  montoFinalTeorico?: number
  montoFinalReal?: number
  diferencia?: number
  usuarioCierreId?: string
  usuarioCierreNombre?: string
}

export interface AbrirCajaRequest {
  montoInicial: number
}

export interface CerrarCajaRequest {
  montoFinalReal: number
}

export interface DispensacionRequest {
  numeroReceta: string
  fechaEmision: string
  prescriptor?: string
  observaciones?: string
  detalles: { productoId: string; cantidad: number; loteId?: string }[]
}

export interface DispensacionResponse {
  id: string
  recetaId: string
  numeroReceta: string
  fechaEmision: string
  prescriptor?: string
  usuarioRegenteId: string
  usuarioRegenteNombre: string
  detalles: {
    id: string
    productoId: string
    productoNombre: string
    loteId: string
    numeroLote: string
    cantidad: number
  }[]
  createdAt?: string
}

export interface ItemCarrito {
  productoId: string
  productoNombre: string
  productoUnidadId: string
  unidad: UnidadMedida
  factorBase: number
  cantidad: number
  precioUnitario: number
  imagenUrl?: string
}

export type TipoAlerta = 'STOCK_CRITICO' | 'VENCIMIENTO_PROXIMO'
export type TipoRecomendacion = 'COMPRA' | 'LIQUIDACION' | 'DESCONTINUACION'
export type EstadoRecomendacion = 'ACTIVA' | 'GESTIONADA' | 'DESCARTADA'
export type TipoDevolucion = 'CLIENTE' | 'PROVEEDOR'
export type MotivoDevolucion =
  | 'ERROR_DESPACHO' | 'DEFECTO_FABRICA' | 'VENCIDO'
  | 'PROXIMO_VENCER' | 'DEFECTO_CALIDAD_EMPAQUE' | 'DISCREPANCIA_PEDIDO'
export type EstadoDevolucion = 'REGISTRADA' | 'CUARENTENA' | 'EN_TRANSITO' | 'DISPUESTA' | 'RECHAZADA'

export interface Alerta {
  id: string
  productoId: string
  productoNombre: string
  loteId?: string
  numeroLote?: string
  tipo: TipoAlerta
  mensaje?: string
  activa: boolean
  fechaGeneracion?: string
  fechaResolucion?: string
}

export interface Recomendacion {
  id: string
  productoId: string
  productoNombre: string
  tipo: TipoRecomendacion
  estado: EstadoRecomendacion
  ventaDiariaPromedio?: number
  coberturaDias?: number
  unidadesVendidas60d?: number
  diasConMovimiento60d?: number
  motivo?: string
  fechaGeneracion?: string
  fechaGestion?: string
  usuarioGestionId?: string
  usuarioGestionNombre?: string
}

export interface GestionarRecomendacionRequest {
  estado: EstadoRecomendacion
}

export interface DetalleDevolucionRequest {
  productoId: string
  loteId?: string
  cantidad: number
}

export interface DevolucionClienteRequest {
  ventaId: string
  clienteId?: string
  motivo: MotivoDevolucion
  observaciones?: string
  detalles: DetalleDevolucionRequest[]
}

export interface DevolucionProveedorRequest {
  proveedorId: string
  motivo: MotivoDevolucion
  notaCredito?: string
  observaciones?: string
  detalles: DetalleDevolucionRequest[]
}

export interface DisponerDevolucionRequest {
  estado: EstadoDevolucion
  observaciones?: string
}

export interface DetalleDevolucionResponse {
  id: string
  productoId: string
  productoNombre: string
  loteId?: string
  numeroLote?: string
  cantidad: number
}

export interface Devolucion {
  id: string
  folio?: number
  tipo: TipoDevolucion
  estado: EstadoDevolucion
  ventaId?: string
  proveedorId?: string
  proveedorRazonSocial?: string
  clienteId?: string
  clienteNombre?: string
  motivo: MotivoDevolucion
  usuarioRegistraId: string
  usuarioRegistraNombre: string
  usuarioAutorizaId?: string
  notaCredito?: string
  fechaDisposicion?: string
  observaciones?: string
  detalles: DetalleDevolucionResponse[]
  createdAt?: string
}

export interface EstanteCriticoDto {
  estanteId: string
  estanteCodigo: string
  cantidadProductosCriticos: number
}

export interface DashboardResponse {
  ventasHoy: number
  ventasMes: number
  cantidadVentasHoy: number
  productosActivos: number
  productosStockCritico: number
  lotesProximosAVencer: number
  alertasActivas: number
  recomendacionesActivas: number
  topEstantesConProductosCriticos: EstanteCriticoDto[]
  ventasUltimos7Dias?: { fecha: string; total: number }[]
}

export interface ReporteStockDto {
  productoId: string
  codigoInterno: string
  nombreComercial: string
  estanteCodigo?: string
  stockActual: number
  stockMinimo: number
  stockMaximo: number
}

export interface ReporteVentaDto {
  ventaId: string
  numeroComprobante?: number
  fecha?: string
  vendedor: string
  cliente?: string
  total: number
  estado: string
}

export interface QrProductoInfo {
  unidadId: string
  unidad: UnidadMedida
  codigoBarras?: string
  contenido: string
}
