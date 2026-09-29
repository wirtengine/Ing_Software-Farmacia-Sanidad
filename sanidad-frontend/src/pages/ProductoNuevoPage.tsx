import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Pill } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useCrearMedicamento, useCrearProductoGeneral } from '@/hooks/useProductos'
import { useEstantes } from '@/hooks/useEstantes'
import { productoService } from '@/api/productoService'
import { UNIDAD_LABELS } from '@/lib/format'
import type { UnidadMedida } from '@/types/domain'

const UNIDADES: UnidadMedida[] = ['TABLETA', 'CAJA', 'BLISTER', 'FRASCO', 'AMPOLLA', 'SOBRE', 'TUBO', 'UNIDAD', 'MILILITRO', 'GRAMO']
const opcional = z.string().optional().transform((v) => (v && v.trim() ? v.trim() : undefined))
const numeroOpcional = z.preprocess((v) => (v === '' || v === null ? undefined : v), z.coerce.number().min(0).optional())

const schema = z.object({
  tipo: z.enum(['MEDICAMENTO', 'GENERAL']),
  codigoInterno: z.string().trim().min(1, 'Obligatorio'),
  codigoSanitario: opcional,
  nombreComercial: z.string().trim().min(1, 'Obligatorio'),
  nombreGenerico: opcional,
  presentacion: opcional,
  categoria: opcional,
  requiereReceta: z.boolean(),
  precioVenta: z.coerce.number({ invalid_type_error: 'Ingresá un precio' }).min(0, 'No puede ser negativo'),
  stockMinimo: numeroOpcional,
  stockMaximo: numeroOpcional,
  estanteId: opcional,
  unidadBase: z.enum(['CAJA', 'BLISTER', 'TABLETA', 'FRASCO', 'AMPOLLA', 'SOBRE', 'TUBO', 'UNIDAD', 'MILILITRO', 'GRAMO']),
}).superRefine((d, ctx) => {
  if (d.tipo === 'MEDICAMENTO') {
    if (!d.codigoSanitario) ctx.addIssue({ code: 'custom', path: ['codigoSanitario'], message: 'Un medicamento requiere código sanitario' })
    if (!d.nombreGenerico) ctx.addIssue({ code: 'custom', path: ['nombreGenerico'], message: 'Un medicamento requiere nombre genérico' })
    if (!d.presentacion) ctx.addIssue({ code: 'custom', path: ['presentacion'], message: 'Un medicamento requiere presentación' })
  }
  if (d.stockMinimo !== undefined && d.stockMaximo !== undefined && d.stockMinimo > d.stockMaximo)
    ctx.addIssue({ code: 'custom', path: ['stockMaximo'], message: 'Debe ser mayor o igual al mínimo' })
})

type FormIn = z.input<typeof schema>
type FormOut = z.output<typeof schema>

function MsgError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-danger">{msg}</motion.p>
}

export function ProductoNuevoPage() {
  const navigate = useNavigate()
  const { data: estantes } = useEstantes()
  const crearMedicamento = useCrearMedicamento()
  const crearGeneral = useCrearProductoGeneral()
  const [foto, setFoto] = useState<File | null>(null)
  const [guardando, setGuardando] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'MEDICAMENTO', unidadBase: 'TABLETA', requiereReceta: false, stockMinimo: 20, stockMaximo: 500 },
  })
  const tipo = watch('tipo')
  const esMed = tipo === 'MEDICAMENTO'

  async function onSubmit(d: FormOut) {
    setGuardando(true)
    try {
      const base = {
        codigoInterno: d.codigoInterno, nombreComercial: d.nombreComercial, nombreGenerico: d.nombreGenerico,
        presentacion: d.presentacion, categoria: d.categoria, precioVenta: d.precioVenta,
        stockMinimo: d.stockMinimo as number, stockMaximo: d.stockMaximo as number,
        estanteId: d.estanteId, unidadBase: d.unidadBase,
      }
      const producto = esMed
        ? await crearMedicamento.mutateAsync({ ...base, codigoSanitario: d.codigoSanitario!, requiereReceta: d.requiereReceta, nombreGenerico: d.nombreGenerico!, presentacion: d.presentacion! })
        : await crearGeneral.mutateAsync(base)
      if (foto) {
        try { await productoService.subirImagen(producto.id, foto) }
        catch { toast.error('El producto se creó, pero la foto no se pudo subir. Probá de nuevo desde el detalle.') }
      }
      navigate(`/productos/${producto.id}`)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('/productos')} className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Volver a productos
      </button>
      <PageHeader title="Nuevo producto" description="Registrá un medicamento o un producto general" />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3" noValidate>
        <Card className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {([['MEDICAMENTO', 'Medicamento', Pill, 'from-mint-100'], ['GENERAL', 'Producto general', Package, 'from-lavender-100']] as const).map(([v, t, Icon, g]) => (
              <button type="button" key={v}
                onClick={() => { setValue('tipo', v); if (v === 'GENERAL') setValue('requiereReceta', false) }}
                className={`flex items-center gap-3 rounded-2xl border-2 bg-gradient-to-br ${g} to-white p-4 text-left transition-all ${tipo === v ? 'border-sage-400 shadow-soft' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <Icon className="h-6 w-6 text-sage-600" strokeWidth={1.75} />
                <span className="font-medium text-ink">{t}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="codigoInterno">Código interno *</Label>
              <Input id="codigoInterno" placeholder="MED-0001" error={!!errors.codigoInterno} {...register('codigoInterno')} />
              <MsgError msg={errors.codigoInterno?.message} />
            </div>
            {esMed && (
              <div>
                <Label htmlFor="codigoSanitario">Código sanitario *</Label>
                <Input id="codigoSanitario" error={!!errors.codigoSanitario} {...register('codigoSanitario')} />
                <MsgError msg={errors.codigoSanitario?.message} />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label htmlFor="nombreComercial">Nombre comercial *</Label>
              <Input id="nombreComercial" placeholder="Acetaminofén MK 500 mg" error={!!errors.nombreComercial} {...register('nombreComercial')} />
              <MsgError msg={errors.nombreComercial?.message} />
            </div>
            <div>
              <Label htmlFor="nombreGenerico">Nombre genérico {esMed && '*'}</Label>
              <Input id="nombreGenerico" placeholder="Paracetamol" error={!!errors.nombreGenerico} {...register('nombreGenerico')} />
              <MsgError msg={errors.nombreGenerico?.message} />
            </div>
            <div>
              <Label htmlFor="presentacion">Presentación {esMed && '*'}</Label>
              <Input id="presentacion" placeholder="Caja x 100 tabletas" error={!!errors.presentacion} {...register('presentacion')} />
              <MsgError msg={errors.presentacion?.message} />
            </div>
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Input id="categoria" placeholder="Analgésicos" {...register('categoria')} />
            </div>
            <div>
              <Label htmlFor="estanteId">Estante</Label>
              <select id="estanteId" className="campo-select" {...register('estanteId')}>
                <option value="">Sin asignar</option>
                {estantes?.filter((e) => e.activo).map((e) => <option key={e.id} value={e.id}>{e.codigo}{e.descripcion ? ` — ${e.descripcion}` : ''}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="unidadBase">Unidad base *</Label>
              <select id="unidadBase" className="campo-select" {...register('unidadBase')}>
                {UNIDADES.map((u) => <option key={u} value={u}>{UNIDAD_LABELS[u]}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="precioVenta">Precio base (C$) *</Label>
              <Input id="precioVenta" type="number" step="0.01" min={0} error={!!errors.precioVenta} {...register('precioVenta')} />
              <MsgError msg={errors.precioVenta?.message} />
            </div>
            <div>
              <Label htmlFor="stockMinimo">Stock mínimo</Label>
              <Input id="stockMinimo" type="number" min={0} {...register('stockMinimo')} />
            </div>
            <div>
              <Label htmlFor="stockMaximo">Stock máximo</Label>
              <Input id="stockMaximo" type="number" min={0} error={!!errors.stockMaximo} {...register('stockMaximo')} />
              <MsgError msg={errors.stockMaximo?.message} />
            </div>
          </div>
          <p className="-mt-2 text-xs text-ink-subtle">
            El precio base es el de la unidad base (ej. una tableta). Luego podés agregar blíster o caja con su propio precio.
          </p>

          {esMed && (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-butter-50 p-3 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4 accent-sage-500" {...register('requiereReceta')} />
              Requiere receta médica (solo el regente podrá dispensarlo)
            </label>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-serif text-base text-ink">Foto del producto</h3>
            <ImageUploader onSelect={setFoto} />
            <p className="mt-2 text-xs text-ink-subtle">Se sube a Supabase Storage al guardar el producto.</p>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" type="button" className="flex-1" onClick={() => navigate('/productos')}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={guardando}>Guardar</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
