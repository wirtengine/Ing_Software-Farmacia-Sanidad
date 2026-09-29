import { useState } from 'react'
import { motion } from 'framer-motion'
import { Boxes, Plus, Table2, Box as BoxIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { EstadoBadge } from '@/components/domain/EstadoBadge'
import { ShelfMap3D } from '@/components/three/ShelfMap3D'
import {
  useEstantes, useCrearEstante, useActualizarEstante, useToggleEstante,
} from '@/hooks/useEstantes'
import { useAuthStore } from '@/store/authStore'
import type { Estante, EstanteRequest } from '@/types/domain'

type Vista = 'tabla' | 'mapa'

export function EstantesPage() {
  const { data: estantes, isLoading } = useEstantes()
  const crear = useCrearEstante()
  const actualizar = useActualizarEstante()
  const toggle = useToggleEstante()
  const hasRole = useAuthStore((s) => s.hasRole)
  const esAdmin = hasRole('ADMIN')

  const [vista, setVista] = useState<Vista>('tabla')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Estante | null>(null)
  const [form, setForm] = useState<EstanteRequest>({ codigo: '', descripcion: '', ubicacionFisica: '' })

  function abrirCrear() {
    setEditando(null)
    setForm({ codigo: '', descripcion: '', ubicacionFisica: '' })
    setDialogOpen(true)
  }

  function abrirEditar(estante: Estante) {
    setEditando(estante)
    setForm({
      codigo: estante.codigo,
      descripcion: estante.descripcion ?? '',
      ubicacionFisica: estante.ubicacionFisica ?? '',
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

  const columns: Column<Estante>[] = [
    { key: 'codigo', header: 'Código', render: (e) => <span className="font-mono font-medium">{e.codigo}</span> },
    { key: 'descripcion', header: 'Descripción', render: (e) => e.descripcion || '—' },
    { key: 'ubicacion', header: 'Ubicación', render: (e) => e.ubicacionFisica || '—' },
    { key: 'estado', header: 'Estado', render: (e) => <EstadoBadge activo={e.activo} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Estantes"
        description="Ubicaciones físicas donde se guardan los productos"
        actions={
          <>
            <div className="flex bg-surface-warm rounded-lg p-1">
              <button
                onClick={() => setVista('tabla')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  vista === 'tabla' ? 'bg-surface shadow-soft text-sage-700' : 'text-ink-muted'
                }`}
              >
                <Table2 className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Tabla</span>
              </button>
              <button
                onClick={() => setVista('mapa')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  vista === 'mapa' ? 'bg-surface shadow-soft text-sage-700' : 'text-ink-muted'
                }`}
              >
                <BoxIcon className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Mapa 3D</span>
              </button>
            </div>
            {esAdmin && (
              <Button onClick={abrirCrear}>
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                Nuevo estante
              </Button>
            )}
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : !estantes || estantes.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Todavía no hay estantes"
          description="Creá el primero para empezar a ubicar tus productos."
          action={esAdmin && <Button onClick={abrirCrear}>Crear estante</Button>}
        />
      ) : vista === 'tabla' ? (
        <DataTable
          columns={columns}
          data={estantes}
          keyExtractor={(e) => e.id}
          onRowClick={esAdmin ? abrirEditar : undefined}
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ShelfMap3D estantes={estantes} onSelectEstante={esAdmin ? abrirEditar : () => {}} />
          <p className="text-xs text-ink-subtle text-center mt-3">
            Arrastrá para rotar, hacé scroll para acercar. Pasá el mouse sobre un bloque para ver el detalle.
          </p>
        </motion.div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editando ? 'Editar estante' : 'Nuevo estante'}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              placeholder="A-01"
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Analgésicos y antiinflamatorios"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="ubicacion">Ubicación física</Label>
            <Input
              id="ubicacion"
              placeholder="Pasillo 1, lado derecho"
              value={form.ubicacionFisica}
              onChange={(e) => setForm({ ...form, ubicacionFisica: e.target.value })}
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
