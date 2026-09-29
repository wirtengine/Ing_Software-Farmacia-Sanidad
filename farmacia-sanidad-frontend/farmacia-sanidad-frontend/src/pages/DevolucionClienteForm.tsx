import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useRegistrarDevolucionCliente } from '@/hooks/useDevoluciones'
import { useProductos } from '@/hooks/useProductos'
import type { DetalleDevolucionRequest, MotivoDevolucion } from '@/types/domain'

const motivos: { value: MotivoDevolucion; label: string }[] = [
  { value: 'ERROR_DESPACHO', label: 'Error de despacho' },
  { value: 'DEFECTO_FABRICA', label: 'Defecto de fábrica' },
]

export function DevolucionClienteForm() {
  const navigate = useNavigate()
  const { data: productos } = useProductos()
  const registrar = useRegistrarDevolucionCliente()

  const [ventaId, setVentaId] = useState('')
  const [motivo, setMotivo] = useState<MotivoDevolucion>('ERROR_DESPACHO')
  const [observaciones, setObservaciones] = useState('')
  const [detalles, setDetalles] = useState<DetalleDevolucionRequest[]>([{ productoId: '', cantidad: 1 }])

  function actualizarDetalle(index: number, campo: keyof DetalleDevolucionRequest, valor: string | number) {
    setDetalles((prev) => prev.map((d, i) => (i === index ? { ...d, [campo]: valor } : d)))
  }

  async function guardar() {
    await registrar.mutateAsync({ ventaId, motivo, observaciones, detalles })
    navigate('/devoluciones')
  }

  return (
    <div className="max-w-xl">
      <button
        onClick={() => navigate('/devoluciones')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Volver a devoluciones
      </button>

      <PageHeader title="Devolución de cliente" description="Registrá un producto devuelto por un cliente" />

      <Card>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ventaId">ID de la venta</Label>
            <Input id="ventaId" value={ventaId} onChange={(e) => setVentaId(e.target.value)} placeholder="UUID de la venta" />
          </div>

          <div>
            <Label htmlFor="motivo">Motivo</Label>
            <select
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as MotivoDevolucion)}
              className="w-full h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
            >
              {motivos.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Productos devueltos</Label>
            <div className="space-y-2">
              {detalles.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={d.productoId}
                    onChange={(e) => actualizarDetalle(i, 'productoId', e.target.value)}
                    className="flex-1 h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
                  >
                    <option value="">Seleccioná un producto</option>
                    {productos?.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombreComercial}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min={1}
                    className="w-24"
                    value={d.cantidad}
                    onChange={(e) => actualizarDetalle(i, 'cantidad', Number(e.target.value))}
                  />
                  {detalles.length > 1 && (
                    <button onClick={() => setDetalles((prev) => prev.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-4 w-4 text-ink-subtle hover:text-danger" strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setDetalles((prev) => [...prev, { productoId: '', cantidad: 1 }])}
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Agregar producto
            </Button>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border-soft text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate('/devoluciones')}>
              Cancelar
            </Button>
            <Button onClick={guardar} loading={registrar.isPending} disabled={!ventaId}>
              Registrar devolución
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
