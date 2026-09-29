import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Stethoscope } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useDispensaciones, useRegistrarDispensacion } from '@/hooks/useDispensaciones'
import { useProductos } from '@/hooks/useProductos'
import { formatFecha } from '@/lib/format'

const schema = z.object({
  numeroReceta: z.string().min(1, 'Obligatorio'),
  fechaEmision: z.string().min(1, 'Obligatorio'),
  prescriptor: z.string().trim().min(1, 'El médico prescriptor es obligatorio'),
  observaciones: z.string().optional(),
  detalles: z.array(
    z.object({
      productoId: z.string().min(1, 'Requerido'),
      cantidad: z.coerce.number().min(1),
    })
  ).min(1, 'Agregá al menos un producto'),
})

type FormData = z.infer<typeof schema>

export function DispensacionPage() {
  const { data: dispensaciones, isLoading } = useDispensaciones()
  const { data: productos } = useProductos()
  const registrar = useRegistrarDispensacion()
  const [mostrarForm, setMostrarForm] = useState(false)

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { detalles: [{ productoId: '', cantidad: 1 }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })

  async function onSubmit(data: FormData) {
    await registrar.mutateAsync(data)
    reset({ numeroReceta: '', fechaEmision: '', prescriptor: '', observaciones: '', detalles: [{ productoId: '', cantidad: 1 }] })
    setMostrarForm(false)
  }

  return (
    <div>
      <PageHeader
        title="Dispensación con receta"
        description="Registrá la entrega de medicamentos bajo receta médica"
        actions={
          <Button onClick={() => setMostrarForm(!mostrarForm)}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Nueva dispensación
          </Button>
        }
      />

      {mostrarForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroReceta">N.° de receta</Label>
                <Input id="numeroReceta" {...register('numeroReceta')} error={!!errors.numeroReceta} />
              </div>
              <div>
                <Label htmlFor="fechaEmision">Fecha de emisión</Label>
                <Input id="fechaEmision" type="date" {...register('fechaEmision')} error={!!errors.fechaEmision} />
              </div>
            </div>

            <div>
              <Label htmlFor="prescriptor">Médico prescriptor *</Label>
              <Input id="prescriptor" error={!!errors.prescriptor} {...register('prescriptor')} />
              {errors.prescriptor && <p className="text-xs text-danger mt-1">{errors.prescriptor.message}</p>}
            </div>

            <div>
              <Label>Productos a dispensar</Label>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <select
                      {...register(`detalles.${index}.productoId`)}
                      className="flex-1 h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
                    >
                      <option value="">Seleccioná un producto</option>
                      {productos?.filter((p) => p.requiereReceta).map((p) => (
                        <option key={p.id} value={p.id}>{p.nombreComercial}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      {...register(`detalles.${index}.cantidad`)}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-ink-subtle hover:text-danger px-2"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => append({ productoId: '', cantidad: 1 })}
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                Agregar producto
              </Button>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones (opcional)</Label>
              <textarea
                id="observaciones"
                {...register('observaciones')}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border-soft text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setMostrarForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={registrar.isPending}>
                Registrar dispensación
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <p className="text-sm text-ink-muted">Cargando…</p>
      ) : !dispensaciones || dispensaciones.length === 0 ? (
        <EmptyState icon={Stethoscope} title="Todavía no hay dispensaciones" description="Las dispensaciones con receta aparecerán acá." />
      ) : (
        <div className="space-y-3">
          {dispensaciones.map((d) => (
            <Card key={d.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-medium">{d.numeroReceta}</span>
                <span className="text-xs text-ink-subtle">{formatFecha(d.fechaEmision)}</span>
              </div>
              <p className="text-xs text-ink-muted mb-2">
                {d.prescriptor && `Dr(a). ${d.prescriptor} · `}Regente: {d.usuarioRegenteNombre}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {d.detalles.map((det) => (
                  <span key={det.id} className="text-xs bg-surface-warm px-2 py-1 rounded-md">
                    {det.cantidad}x {det.productoNombre}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
