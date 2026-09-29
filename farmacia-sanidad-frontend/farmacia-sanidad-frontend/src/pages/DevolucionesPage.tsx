import { useNavigate } from 'react-router-dom'
import { RotateCcw, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'
import { useDevoluciones } from '@/hooks/useDevoluciones'
import { useAuthStore } from '@/store/authStore'
import { formatFecha } from '@/lib/format'
import type { Devolucion } from '@/types/domain'

const estadoVariant: Record<string, 'sage' | 'warning' | 'danger' | 'neutral'> = {
  REGISTRADA: 'neutral',
  CUARENTENA: 'warning',
  EN_TRANSITO: 'neutral',
  DISPUESTA: 'sage',
  RECHAZADA: 'danger',
}

export function DevolucionesPage() {
  const { data: devoluciones, isLoading } = useDevoluciones()
  const navigate = useNavigate()
  const puedeRegistrar = useAuthStore((st) => st.hasRole('ADMIN', 'REGENTE'))

  const columns: Column<Devolucion>[] = [
    { key: 'folio', header: 'Folio', render: (d) => <span className="font-mono">{d.folio ?? '—'}</span> },
    { key: 'tipo', header: 'Tipo', render: (d) => (d.tipo === 'CLIENTE' ? 'De cliente' : 'A proveedor') },
    { key: 'quien', header: 'Cliente/Proveedor', render: (d) => d.clienteNombre ?? d.proveedorRazonSocial ?? '—' },
    { key: 'motivo', header: 'Motivo', render: (d) => d.motivo.replaceAll('_', ' ').toLowerCase() },
    { key: 'fecha', header: 'Fecha', render: (d) => formatFecha(d.createdAt) },
    { key: 'estado', header: 'Estado', render: (d) => <Badge variant={estadoVariant[d.estado]}>{d.estado}</Badge> },
  ]

  return (
    <div>
      <PageHeader
        title="Devoluciones"
        description="Devoluciones de clientes y a proveedores"
        actions={
          puedeRegistrar && <DropdownMenu
            trigger={
              <Button>
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                Nueva devolución
              </Button>
            }
          >
            <DropdownMenuItem onClick={() => navigate('/devoluciones/nueva-cliente')}>
              De un cliente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/devoluciones/nueva-proveedor')}>
              A un proveedor
            </DropdownMenuItem>
          </DropdownMenu>
        }
      />

      {isLoading ? (
        <p className="text-sm text-ink-muted">Cargando…</p>
      ) : !devoluciones || devoluciones.length === 0 ? (
        <EmptyState icon={RotateCcw} title="Todavía no hay devoluciones" description="Las devoluciones que registrés aparecerán acá." />
      ) : (
        <DataTable columns={columns} data={devoluciones} keyExtractor={(d) => d.id} />
      )}
    </div>
  )
}
