import { useState } from 'react'
import { Truck, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { SearchInput } from '@/components/common/SearchInput'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { EstadoBadge } from '@/components/domain/EstadoBadge'
import { ProveedorContacto } from '@/components/domain/ProveedorRow'
import {
  useProveedores, useCrearProveedor, useActualizarProveedor, useToggleProveedor,
} from '@/hooks/useProveedores'
import type { Proveedor, ProveedorRequest } from '@/types/domain'

export function ProveedoresPage() {
  const { data: proveedores, isLoading } = useProveedores()
  const crear = useCrearProveedor()
  const actualizar = useActualizarProveedor()
  const toggle = useToggleProveedor()

  const [busqueda, setBusqueda] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [form, setForm] = useState<ProveedorRequest>({
    ruc: '', razonSocial: '', telefono: '', correoElectronico: '',
  })

  const filtrados = (proveedores ?? []).filter(
    (p) =>
      p.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ruc.toLowerCase().includes(busqueda.toLowerCase())
  )

  function abrirCrear() {
    setEditando(null)
    setForm({ ruc: '', razonSocial: '', telefono: '', correoElectronico: '' })
    setDialogOpen(true)
  }

  function abrirEditar(proveedor: Proveedor) {
    setEditando(proveedor)
    setForm({
      ruc: proveedor.ruc,
      razonSocial: proveedor.razonSocial,
      telefono: proveedor.telefono ?? '',
      correoElectronico: proveedor.correoElectronico ?? '',
    })
    setDialogOpen(true)
  }

  async function guardar() {
    if (editando) {
      await actualizar.mutateAsync({ id: editando.id, data: form })
    } else {
      await crear.mutateAsync(form)
    }
    setDialogOpen(false)
  }

  const columns: Column<Proveedor>[] = [
    { key: 'razonSocial', header: 'Proveedor', render: (p) => <span className="font-medium">{p.razonSocial}</span> },
    { key: 'ruc', header: 'RUC', render: (p) => <span className="font-mono text-xs">{p.ruc}</span> },
    { key: 'contacto', header: 'Contacto', render: (p) => <ProveedorContacto proveedor={p} /> },
    { key: 'estado', header: 'Estado', render: (p) => <EstadoBadge activo={p.activo} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Proveedores"
        description="Empresas que abastecen tu inventario"
        actions={
          <>
            <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar proveedor…" />
            <Button onClick={abrirCrear}>
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Nuevo proveedor
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={busqueda ? 'No encontramos nada' : 'Todavía no hay proveedores'}
          description={busqueda ? 'Probá con otro nombre o RUC.' : 'Registrá tu primer proveedor.'}
          action={!busqueda && <Button onClick={abrirCrear}>Crear proveedor</Button>}
        />
      ) : (
        <DataTable columns={columns} data={filtrados} keyExtractor={(p) => p.id} onRowClick={abrirEditar} />
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editando ? 'Editar proveedor' : 'Nuevo proveedor'}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="ruc">RUC</Label>
            <Input id="ruc" value={form.ruc} onChange={(e) => setForm({ ...form, ruc: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="razonSocial">Razón social</Label>
            <Input
              id="razonSocial"
              value={form.razonSocial}
              onChange={(e) => setForm({ ...form, razonSocial: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={form.correoElectronico}
              onChange={(e) => setForm({ ...form, correoElectronico: e.target.value })}
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            {editando && (
              <Button
                type="button"
                variant="ghost"
                className={editando.activo ? 'text-danger' : 'text-sage-600'}
                onClick={() => toggle.mutate({ id: editando.id, activo: editando.activo })}
              >
                {editando.activo ? 'Desactivar' : 'Activar'}
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={guardar} loading={crear.isPending || actualizar.isPending}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
