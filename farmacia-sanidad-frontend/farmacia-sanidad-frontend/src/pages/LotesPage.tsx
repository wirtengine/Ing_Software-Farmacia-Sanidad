import { useNavigate } from 'react-router-dom'
import { Layers, Plus, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useLotes } from '@/hooks/useLotes'
import { useAuthStore } from '@/store/authStore'
import { formatFecha } from '@/lib/format'
import type { Lote, EstadoLote } from '@/types/domain'

const estadoVariant: Record<EstadoLote, 'sage' | 'warning' | 'danger' | 'neutral'> = {
  DISPONIBLE: 'sage',
  VENCIDO: 'danger',
  CUARENTENA: 'warning',
  EN_TRANSITO_PROVEEDOR: 'neutral',
  AGOTADO: 'neutral',
}

export function LotesPage() {
  const { data: lotes, isLoading } = useLotes()
  const navigate = useNavigate()
  const esAdmin = useAuthStore((st) => st.hasRole('ADMIN'))

  function estaProximoAVencer(fecha?: string) {
    if (!fecha) return false
    const dias = (new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return dias <= 30 && dias >= 0
  }

  const columns: Column<Lote>[] = [
    { key: 'numeroLote', header: 'N.° de lote', render: (l) => <span className="font-mono text-xs">{l.numeroLote}</span> },
    { key: 'producto', header: 'Producto', render: (l) => l.productoNombre },
    {
      key: 'vencimiento',
      header: 'Vencimiento',
      render: (l) => (
        <span className="flex items-center gap-1.5">
          {formatFecha(l.fechaVencimiento)}
          {estaProximoAVencer(l.fechaVencimiento) && (
            <AlertTriangle className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />
          )}
        </span>
      ),
    },
    { key: 'cantidad', header: 'Disponible', render: (l) => `${l.cantidadDisponible} / ${l.cantidadInicial}` },
    { key: 'proveedor', header: 'Proveedor', render: (l) => l.proveedorRazonSocial ?? '—' },
    { key: 'estado', header: 'Estado', render: (l) => <Badge variant={estadoVariant[l.estado]}>{l.estado}</Badge> },
  ]

  return (
    <div>
      <PageHeader
        title="Lotes"
        description="Entradas de inventario con seguimiento FEFO"
        actions={
          esAdmin && (
            <Button onClick={() => navigate('/lotes/nuevo')}>
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Registrar lote
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : !lotes || lotes.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Todavía no hay lotes registrados"
          description="Registrá la entrada de un lote para empezar a controlar vencimientos."
          action={esAdmin && <Button onClick={() => navigate('/lotes/nuevo')}>Registrar lote</Button>}
        />
      ) : (
        <DataTable columns={columns} data={lotes} keyExtractor={(l) => l.id} />
      )}
    </div>
  )
}
