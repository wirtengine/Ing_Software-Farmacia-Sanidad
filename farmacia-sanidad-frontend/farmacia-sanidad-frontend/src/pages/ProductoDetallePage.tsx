import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Box, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { EstadoBadge } from '@/components/domain/EstadoBadge'
import { Producto3DPreview } from '@/components/three/Producto3DPreview'
import {
  useProducto, useAgregarUnidad, useEliminarUnidad, useToggleProducto, useSubirImagen, useEliminarImagen,
} from '@/hooks/useProductos'
import { useAuthStore } from '@/store/authStore'
import { formatCordobas, UNIDAD_LABELS } from '@/lib/format'
import type { ProductoUnidadRequest, UnidadMedida } from '@/types/domain'

const UNIDADES: UnidadMedida[] = ['CAJA', 'BLISTER', 'TABLETA', 'FRASCO', 'AMPOLLA', 'SOBRE', 'TUBO', 'UNIDAD', 'MILILITRO', 'GRAMO']
const vacio: ProductoUnidadRequest = { unidad: 'BLISTER', factorBase: 10, esUnidadBase: false, codigoBarras: '', precioVenta: 0 }

export function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: producto, isLoading } = useProducto(id)
  const agregarUnidad = useAgregarUnidad()
  const eliminarUnidad = useEliminarUnidad()
  const toggle = useToggleProducto()
  const subirImagen = useSubirImagen()
  const eliminarImagen = useEliminarImagen()
  const esAdmin = useAuthStore((s) => s.hasRole('ADMIN'))

  const [vista, setVista] = useState<'3d' | 'foto'>('3d')
  const [dialogUnidad, setDialogUnidad] = useState(false)
  const [form, setForm] = useState<ProductoUnidadRequest>(vacio)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-6 lg:grid-cols-3"><Skeleton className="h-80" /><Skeleton className="h-80 lg:col-span-2" /></div>
      </div>
    )
  }
  if (!producto || !id) return null

  const unidadBase = producto.unidades?.find((u) => u.esUnidadBase)

  async function guardarUnidad() {
    await agregarUnidad.mutateAsync({ id: id!, data: { ...form, codigoBarras: form.codigoBarras || undefined } })
    setDialogUnidad(false)
    setForm(vacio)
  }

  return (
    <div>
      <button onClick={() => navigate('/productos')} className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Volver a productos
      </button>

      <PageHeader
        title={producto.nombreComercial}
        description={[producto.nombreGenerico, producto.presentacion].filter(Boolean).join(' · ') || undefined}
        actions={
          <>
            <EstadoBadge activo={producto.activo} />
            {esAdmin && (
              <Button variant="outline" onClick={() => toggle.mutate({ id: producto.id, activo: producto.activo })}>
                {producto.activo ? 'Desactivar' : 'Activar'}
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-4">
            <div className="mb-3 flex gap-1 rounded-xl bg-sage-50 p-1">
              {([['3d', 'Vista 3D', Box], ['foto', 'Foto', ImageIcon]] as const).map(([k, t, Icon]) => (
                <button key={k} onClick={() => setVista(k)}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors ${vista === k ? 'text-sage-700' : 'text-ink-muted'}`}>
                  {vista === k && <motion.span layoutId="vista-producto" className="absolute inset-0 -z-10 rounded-lg bg-white shadow-soft" />}
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} /> {t}
                </button>
              ))}
            </div>
            {vista === '3d' ? (
              <Producto3DPreview unidadBase={producto.unidadBase} imagenUrl={producto.imagenUrl} />
            ) : producto.imagenUrl ? (
              <img src={producto.imagenUrl} alt={producto.nombreComercial} className="h-72 w-full rounded-2xl bg-white object-contain" />
            ) : (
              <div className="flex h-72 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-50 to-lavender-50 text-sm text-ink-muted">
                Este producto todavía no tiene foto
              </div>
            )}
            <p className="mt-2 text-center text-[11px] text-ink-subtle">
              La forma 3D depende de la unidad base; la foto se aplica como textura.
            </p>
          </Card>

          {esAdmin && (
            <Card>
              <h3 className="mb-3 font-serif text-base text-ink">Foto del producto</h3>
              <ImageUploader
                currentImageUrl={producto.imagenUrl}
                onUpload={async (archivo, onProgreso) => { await subirImagen.mutateAsync({ id, archivo, onProgreso }) }}
                onRemove={producto.imagenUrl ? async () => { await eliminarImagen.mutateAsync(id) } : undefined}
              />
            </Card>
          )}

          <Card>
            <h3 className="mb-3 font-serif text-base text-ink">Información general</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                ['Tipo', producto.tipoProducto === 'MEDICAMENTO' ? 'Medicamento' : 'Producto general'],
                ['Código interno', producto.codigoInterno],
                ['Código sanitario', producto.codigoSanitario],
                ['Categoría', producto.categoria],
                ['Estante', producto.estanteCodigo],
                ['Receta', producto.requiereReceta ? 'Sí, requiere receta' : 'Venta libre'],
                ['Stock mín / máx', `${producto.stockMinimo ?? '—'} / ${producto.stockMaximo ?? '—'}`],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">Unidades de venta</h3>
              {esAdmin && (
                <Button size="sm" onClick={() => setDialogUnidad(true)}>
                  <Plus className="h-4 w-4" strokeWidth={1.75} /> Agregar
                </Button>
              )}
            </div>
            <p className="mb-4 text-sm text-ink-muted">
              Fraccionamiento: cada unidad equivale a cierta cantidad de {unidadBase ? UNIDAD_LABELS[unidadBase.unidad].toLowerCase() + 's' : 'unidades base'}.
            </p>

            {!producto.unidades?.length ? (
              <p className="py-8 text-center text-sm text-ink-muted">Todavía no hay unidades configuradas.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {producto.unidades.filter((u) => u.activo).map((u, i) => (
                  <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`rounded-2xl border p-4 ${u.esUnidadBase ? 'border-sage-200 bg-mint-50' : 'border-border-soft bg-white/80'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base text-ink">{UNIDAD_LABELS[u.unidad]}</span>
                          {u.esUnidadBase && <Badge variant="sage">Base</Badge>}
                        </div>
                        <p className="text-xs text-ink-subtle">
                          {u.esUnidadBase ? 'Unidad mínima de venta' : `Contiene ${u.factorBase} ${unidadBase ? UNIDAD_LABELS[unidadBase.unidad].toLowerCase() + 's' : 'unidades'}`}
                        </p>
                      </div>
                      {esAdmin && !u.esUnidadBase && (
                        <button onClick={() => eliminarUnidad.mutate({ id, unidadId: u.id })} aria-label="Eliminar unidad"
                          className="rounded-lg p-1 text-ink-subtle transition-colors hover:bg-blush-50 hover:text-danger">
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="font-mono text-[11px] text-ink-subtle">{u.codigoBarras || 'sin código de barras'}</span>
                      <span className="font-serif text-xl text-sage-700">{formatCordobas(u.precioVenta)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={dialogUnidad} onClose={() => setDialogUnidad(false)} title="Nueva unidad de venta">
        <div className="space-y-4">
          <div>
            <Label htmlFor="unidad">Unidad</Label>
            <select id="unidad" className="campo-select" value={form.unidad}
              onChange={(e) => setForm({ ...form, unidad: e.target.value as UnidadMedida })}>
              {UNIDADES.map((u) => <option key={u} value={u}>{UNIDAD_LABELS[u]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="factor">¿Cuántas unidades base trae?</Label>
              <Input id="factor" type="number" min={1} value={form.factorBase}
                onChange={(e) => setForm({ ...form, factorBase: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="precio">Precio (C$)</Label>
              <Input id="precio" type="number" step="0.01" min={0} value={form.precioVenta}
                onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label htmlFor="barras">Código de barras (opcional)</Label>
            <Input id="barras" value={form.codigoBarras ?? ''} onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogUnidad(false)}>Cancelar</Button>
            <Button onClick={guardarUnidad} loading={agregarUnidad.isPending}>Guardar</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
