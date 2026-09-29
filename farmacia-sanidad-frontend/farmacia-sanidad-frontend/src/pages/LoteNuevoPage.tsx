import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useRegistrarLote } from '@/hooks/useLotes'
import { useProductos } from '@/hooks/useProductos'
import { useProveedores } from '@/hooks/useProveedores'

const schema = z.object({
  productoId: z.string().min(1, 'Seleccioná un producto'),
  proveedorId: z.string().optional(),
  numeroLote: z.string().min(1, 'Obligatorio'),
  fechaFabricacion: z.string().optional(),
  fechaVencimiento: z.string().min(1, 'Obligatorio'),
  cantidad: z.coerce.number().min(1, 'Debe ser mayor a 0'),
})

type FormData = z.infer<typeof schema>

export function LoteNuevoPage() {
  const navigate = useNavigate()
  const { data: productos } = useProductos()
  const { data: proveedores } = useProveedores()
  const registrar = useRegistrarLote()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    await registrar.mutateAsync(data)
    navigate('/lotes')
  }

  return (
    <div className="max-w-xl">
      <button
        onClick={() => navigate('/lotes')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Volver a lotes
      </button>

      <PageHeader title="Registrar lote" description="Entrada de inventario con fecha de vencimiento" />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="productoId">Producto</Label>
            <select
              id="productoId"
              {...register('productoId')}
              className="w-full h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
            >
              <option value="">Seleccioná un producto</option>
              {productos?.map((p) => (
                <option key={p.id} value={p.id}>{p.nombreComercial} ({p.codigoInterno})</option>
              ))}
            </select>
            {errors.productoId && <p className="text-xs text-danger mt-1">{errors.productoId.message}</p>}
          </div>

          <div>
            <Label htmlFor="proveedorId">Proveedor (opcional)</Label>
            <select
              id="proveedorId"
              {...register('proveedorId')}
              className="w-full h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
            >
              <option value="">Sin proveedor</option>
              {proveedores?.map((p) => (
                <option key={p.id} value={p.id}>{p.razonSocial}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="numeroLote">Número de lote</Label>
            <Input id="numeroLote" {...register('numeroLote')} error={!!errors.numeroLote} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaFabricacion">Fecha de fabricación</Label>
              <Input id="fechaFabricacion" type="date" {...register('fechaFabricacion')} />
            </div>
            <div>
              <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
              <Input id="fechaVencimiento" type="date" {...register('fechaVencimiento')} error={!!errors.fechaVencimiento} />
            </div>
          </div>

          <div>
            <Label htmlFor="cantidad">Cantidad (en unidad base)</Label>
            <Input id="cantidad" type="number" min={1} {...register('cantidad')} error={!!errors.cantidad} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate('/lotes')}>
              Cancelar
            </Button>
            <Button type="submit" loading={registrar.isPending}>
              Registrar entrada
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
