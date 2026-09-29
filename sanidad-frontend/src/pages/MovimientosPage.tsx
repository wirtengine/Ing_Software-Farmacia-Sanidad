import { ArrowLeftRight } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useMovimientos } from '@/hooks/useMovimientos'
import { formatFechaHora } from '@/lib/format'
import type { MovimientoResponse, TipoMovimiento } from '@/types/domain'

const tipoLabels: Record<TipoMovimiento, string> = {
  ENTRADA_COMPRA: 'Entrada por compra',
  SALIDA_VENTA: 'Salida por venta',
  DISPENSACION_RECETA: 'Dispensación',
  AJUSTE_ENTRADA: 'Ajuste (entrada)',
  AJUSTE_SALIDA: 'Ajuste (salida)',
  DEVOLUCION_PROVEEDOR: 'Devolución a proveedor',
  DEVOLUCION_CLIENTE_REINGRESO: 'Devolución de cliente',
  ANULACION_VENTA: 'Anulación de venta',
}

const tipoVariant: Record<string, 'sage' | 'danger' | 'warning' | 'neutral'> = {
  ENTRADA_COMPRA: 'sage',
  AJUSTE_ENTRADA: 'sage',
  DEVOLUCION_CLIENTE_REINGRESO: 'sage',
  SALIDA_VENTA: 'neutral',
  DISPENSACION_RECETA: 'neutral',
  AJUSTE_SALIDA: 'warning',
  DEVOLUCION_PROVEEDOR: 'warning',
  ANULACION_VENTA: 'danger',
}

export function MovimientosPage() {
  const { data: movimientos, isLoading } = useMovimientos()

  const columns: Column<MovimientoResponse>[] = [
    { key: 'fecha', header: 'Fecha', render: (m) => formatFechaHora(m.createdAt) },
    { key: 'producto', header: 'Producto', render: (m) => m.productoNombre },
    { key: 'tipo', header: 'Tipo', render: (m) => <Badge variant={tipoVariant[m.tipo]}>{tipoLabels[m.tipo]}</Badge> },
    { key: 'cantidad', header: 'Cantidad base', render: (m) => m.cantidadBase ?? m.cantidad },
    { key: 'usuario', header: 'Usuario', render: (m) => m.usuarioNombre },
    { key: 'stock', header: 'Stock resultante', render: (m) => m.stockPosterior ?? '—' },
  ]

  return (
    <div>
      <PageHeader title="Movimientos de inventario" description="Historial completo de entradas y salidas" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : !movimientos || movimientos.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="Todo tranquilo por aquí" description="Todavía no hay movimientos registrados." />
      ) : (
        <DataTable columns={columns} data={movimientos} keyExtractor={(m) => m.id} />
      )}
    </div>
  )
}
