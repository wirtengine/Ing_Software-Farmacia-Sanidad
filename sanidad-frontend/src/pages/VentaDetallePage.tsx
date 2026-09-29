import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ban } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Dialog } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { useVenta, useComprobante, useAnularVenta } from '@/hooks/useVentas'
import { useAuthStore } from '@/store/authStore'
import { formatCordobas, formatFechaHora, UNIDAD_LABELS } from '@/lib/format'
import { ComprobanteVenta } from '@/components/pos/ComprobanteVenta'

const estadoVariant: Record<string, 'sage' | 'danger' | 'neutral'> = {
  COMPLETADA: 'sage',
  ANULADA: 'danger',
  ABIERTA: 'neutral',
}

export function VentaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: venta, isLoading } = useVenta(id)
  const { data: comprobante } = useComprobante(id)
  const anular = useAnularVenta()
  const hasRole = useAuthStore((s) => s.hasRole)

  const [dialogAnular, setDialogAnular] = useState(false)
  const [motivo, setMotivo] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!venta) return null

  async function handleAnular() {
    if (!id) return
    await anular.mutateAsync({ id, data: { motivo } })
    setDialogAnular(false)
  }

  const puedeAnular = venta.estado === 'COMPLETADA' && hasRole('ADMIN', 'REGENTE')

  return (
    <div>
      <button
        onClick={() => navigate('/ventas')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Volver a ventas
      </button>

      <PageHeader
        title={`Venta N.° ${venta.numeroComprobante ?? '—'}`}
        description={formatFechaHora(venta.createdAt)}
        actions={
          <>
            <Badge variant={estadoVariant[venta.estado]}>{venta.estado}</Badge>
            {puedeAnular && (
              <Button variant="danger" onClick={() => setDialogAnular(true)}>
                <Ban className="h-4 w-4" strokeWidth={1.75} />
                Anular
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="font-serif text-base text-ink mb-4">Detalle de productos</h3>
            <div className="space-y-2">
              {venta.detalles.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-warm">
                  <div>
                    <p className="text-sm font-medium text-ink">{d.productoNombre}</p>
                    <p className="text-xs text-ink-subtle">
                      {d.cantidad} × {d.unidadVendida ? UNIDAD_LABELS[d.unidadVendida] : ''} · {formatCordobas(d.precioUnitario)}
                    </p>
                  </div>
                  <span className="font-semibold text-sage-700 text-sm">
                    {formatCordobas(d.subtotal ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {venta.estado === 'ANULADA' && venta.motivoAnulacion && (
            <Card className="border-danger/30 bg-danger/5">
              <h3 className="font-serif text-base text-danger mb-1">Motivo de anulación</h3>
              <p className="text-sm text-ink-muted">{venta.motivoAnulacion}</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Cliente</dt>
                <dd>{venta.clienteNombre ?? 'Venta libre'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Vendedor</dt>
                <dd>{venta.usuarioVendedorNombre}</dd>
              </div>
              <div className="flex justify-between border-t border-border-soft pt-2.5">
                <dt className="text-ink-muted font-medium">Total</dt>
                <dd className="font-semibold text-sage-700">{formatCordobas(venta.total)}</dd>
              </div>
            </dl>
          </Card>

          {comprobante && <ComprobanteVenta comprobante={comprobante} />}
        </div>
      </div>

      <Dialog open={dialogAnular} onClose={() => setDialogAnular(false)} title="¿Seguro que querés anular esta venta?">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Esta acción devolverá el stock al inventario y no se puede deshacer.
          </p>
          <div>
            <Label htmlFor="motivo">Motivo de la anulación</Label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border-soft text-sm resize-none"
              placeholder="Explicá brevemente por qué se anula…"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogAnular(false)}>
              No, mantener venta
            </Button>
            <Button variant="danger" onClick={handleAnular} loading={anular.isPending} disabled={!motivo.trim()}>
              Sí, anular venta
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
