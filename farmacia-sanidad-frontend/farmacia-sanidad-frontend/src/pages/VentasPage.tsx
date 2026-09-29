import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useVentas } from '@/hooks/useVentas'
import { formatCordobas, formatFechaHora } from '@/lib/format'
import type { VentaResponse } from '@/types/domain'

const estadoVariant: Record<string, 'sage' | 'danger' | 'neutral'> = {
  COMPLETADA: 'sage',
  ANULADA: 'danger',
  ABIERTA: 'neutral',
}

export function VentasPage() {
  const { data: ventas, isLoading } = useVentas()
  const navigate = useNavigate()

  const columns: Column<VentaResponse>[] = [
    { key: 'numero', header: 'N.°', render: (v) => <span className="font-mono">{v.numeroComprobante ?? '—'}</span> },
    { key: 'fecha', header: 'Fecha', render: (v) => formatFechaHora(v.createdAt) },
    { key: 'cliente', header: 'Cliente', render: (v) => v.clienteNombre ?? 'Venta libre' },
    { key: 'vendedor', header: 'Vendedor', render: (v) => v.usuarioVendedorNombre },
    { key: 'total', header: 'Total', render: (v) => <span className="font-semibold text-sage-700">{formatCordobas(v.total)}</span> },
    { key: 'estado', header: 'Estado', render: (v) => <Badge variant={estadoVariant[v.estado]}>{v.estado}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Ventas" description="Historial de ventas realizadas" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : !ventas || ventas.length === 0 ? (
        <EmptyState icon={Receipt} title="Aún no hay ventas hoy" description="Las ventas que registrés aparecerán acá." />
      ) : (
        <DataTable
          columns={columns}
          data={ventas}
          keyExtractor={(v) => v.id}
          onRowClick={(v) => navigate(`/ventas/${v.id}`)}
        />
      )}
    </div>
  )
}
