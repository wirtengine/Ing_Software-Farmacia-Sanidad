import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useRegistrarDevolucionProveedor } from '@/hooks/useDevoluciones'
import { useProductos } from '@/hooks/useProductos'
import { useProveedores } from '@/hooks/useProveedores'
import { useLotesPorProducto } from '@/hooks/useLotes'
import { formatFecha } from '@/lib/format'
import type { DetalleDevolucionRequest, MotivoDevolucion, Producto } from '@/types/domain'

const motivos: { value: MotivoDevolucion; label: string }[] = [
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'PROXIMO_VENCER', label: 'Próximo a vencer' },
  { value: 'DEFECTO_CALIDAD_EMPAQUE', label: 'Defecto de calidad/empaque' },
  { value: 'DISCREPANCIA_PEDIDO', label: 'Discrepancia con el pedido' },
]

function FilaDetalle({
  detalle, productos, onChange, onRemove,
}: {
  detalle: DetalleDevolucionRequest
  productos: Producto[]
  onChange: (d: DetalleDevolucionRequest) => void
  onRemove?: () => void
}) {
  const { data: lotes } = useLotesPorProducto(detalle.productoId || undefined)
  const conStock = (lotes ?? []).filter((l) => l.cantidadDisponible > 0)
  return (
    <div className="grid gap-2 rounded-xl bg-sage-50/60 p-3 sm:grid-cols-[1fr_1fr_90px_auto]">
      <select className="campo-select" value={detalle.productoId}
        onChange={(e) => onChange({ productoId: e.target.value, loteId: undefined, cantidad: detalle.cantidad })}>
        <option value="">Producto…</option>
        {productos.map((p) => <option key={p.id} value={p.id}>{p.nombreComercial}</option>)}
      </select>
      <select className="campo-select" value={detalle.loteId ?? ''} disabled={!detalle.productoId}
        onChange={(e) => onChange({ ...detalle, loteId: e.target.value || undefined })}>
        <option value="">Lote…</option>
        {conStock.map((l) => (
          <option key={l.id} value={l.id}>{l.numeroLote} · vence {formatFecha(l.fechaVencimiento)} · {l.cantidadDisponible} u.</option>
        ))}
      </select>
      <Input type="number" min={1} value={detalle.cantidad} onChange={(e) => onChange({ ...detalle, cantidad: Number(e.target.value) })} />
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label="Quitar fila" className="flex items-center justify-center rounded-lg px-2 text-ink-subtle hover:text-danger">
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
      ) : <span />}
    </div>
  )
}

export function DevolucionProveedorForm() {
  const navigate = useNavigate()
  const { data: productos } = useProductos()
  const { data: proveedores } = useProveedores()
  const registrar = useRegistrarDevolucionProveedor()

  const [proveedorId, setProveedorId] = useState('')
  const [motivo, setMotivo] = useState<MotivoDevolucion>('VENCIDO')
  const [notaCredito, setNotaCredito] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [detalles, setDetalles] = useState<DetalleDevolucionRequest[]>([{ productoId: '', cantidad: 1 }])

  const valido = proveedorId && detalles.every((d) => d.productoId && d.loteId && d.cantidad > 0)

  async function guardar() {
    await registrar.mutateAsync({ proveedorId, motivo, notaCredito: notaCredito || undefined, observaciones: observaciones || undefined, detalles })
    navigate('/devoluciones')
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/devoluciones')} className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Volver a devoluciones
      </button>
      <PageHeader title="Devolución a proveedor" description="El producto sale del lote indicado y queda en tránsito" />

      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="proveedorId">Proveedor *</Label>
            <select id="proveedorId" className="campo-select" value={proveedorId} onChange={(e) => setProveedorId(e.target.value)}>
              <option value="">Seleccioná un proveedor</option>
              {proveedores?.filter((p) => p.activo).map((p) => <option key={p.id} value={p.id}>{p.razonSocial}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="motivo">Motivo *</Label>
            <select id="motivo" className="campo-select" value={motivo} onChange={(e) => setMotivo(e.target.value as MotivoDevolucion)}>
              {motivos.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="notaCredito">N.° de nota de crédito (opcional)</Label>
          <Input id="notaCredito" value={notaCredito} onChange={(e) => setNotaCredito(e.target.value)} />
        </div>

        <div>
          <Label>Productos y lotes *</Label>
          <div className="space-y-2">
            {detalles.map((d, i) => (
              <FilaDetalle key={i} detalle={d} productos={productos ?? []}
                onChange={(nuevo) => setDetalles((prev) => prev.map((x, j) => (j === i ? nuevo : x)))}
                onRemove={detalles.length > 1 ? () => setDetalles((prev) => prev.filter((_, j) => j !== i)) : undefined} />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setDetalles((p) => [...p, { productoId: '', cantidad: 1 }])}>
            <Plus className="h-4 w-4" strokeWidth={1.75} /> Agregar producto
          </Button>
        </div>

        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <textarea id="observaciones" rows={3} value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
            className="w-full resize-none rounded-xl border border-border-soft bg-white/90 px-4 py-2.5 text-sm" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate('/devoluciones')}>Cancelar</Button>
          <Button onClick={guardar} loading={registrar.isPending} disabled={!valido}>Registrar devolución</Button>
        </div>
      </Card>
    </div>
  )
}
