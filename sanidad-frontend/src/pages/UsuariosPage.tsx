import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { EstadoBadge } from '@/components/domain/EstadoBadge'
import { useUsuarios, useRegistrarUsuario, useToggleUsuario } from '@/hooks/useUsuarios'
import { ROL_LABELS, formatFechaHora } from '@/lib/format'
import type { UserDto, RegisterRequest, Rol } from '@/types/domain'

const roles: Rol[] = ['ADMIN', 'REGENTE', 'VENDEDOR']

export function UsuariosPage() {
  const { data: usuarios, isLoading } = useUsuarios()
  const registrar = useRegistrarUsuario()
  const toggle = useToggleUsuario()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<RegisterRequest>({
    username: '', nombreCompleto: '', password: '', rol: 'VENDEDOR',
  })

  async function guardar() {
    await registrar.mutateAsync(form)
    setDialogOpen(false)
    setForm({ username: '', nombreCompleto: '', password: '', rol: 'VENDEDOR' })
  }

  const columns: Column<UserDto>[] = [
    { key: 'nombre', header: 'Nombre', render: (u) => u.nombreCompleto },
    { key: 'username', header: 'Usuario', render: (u) => <span className="font-mono text-xs">{u.username}</span> },
    { key: 'rol', header: 'Rol', render: (u) => ROL_LABELS[u.rol] },
    { key: 'ultimoAcceso', header: 'Último acceso', render: (u) => formatFechaHora(u.ultimoAcceso) },
    { key: 'estado', header: 'Estado', render: (u) => <EstadoBadge activo={u.activo} /> },
    {
      key: 'accion',
      header: '',
      render: (u) => (
        <Button
          size="sm"
          variant="ghost"
          className={u.activo ? 'text-danger' : 'text-sage-600'}
          onClick={(e) => {
            e.stopPropagation()
            toggle.mutate({ id: u.id, activo: u.activo })
          }}
        >
          {u.activo ? 'Desactivar' : 'Activar'}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Gestión de accesos al sistema"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Nuevo usuario
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-ink-muted">Cargando…</p>
      ) : !usuarios || usuarios.length === 0 ? (
        <EmptyState icon={Users} title="Todavía no hay usuarios" description="Registrá el primer usuario del sistema." />
      ) : (
        <DataTable columns={columns} data={usuarios} keyExtractor={(u) => u.id} />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo usuario">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="nombreCompleto">Nombre completo</Label>
            <Input
              id="nombreCompleto"
              value={form.nombreCompleto}
              onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="rol">Rol</Label>
            <select
              id="rol"
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}
              className="w-full h-11 px-4 rounded-lg bg-surface border border-border-soft text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{ROL_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar} loading={registrar.isPending}>
              Registrar usuario
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
