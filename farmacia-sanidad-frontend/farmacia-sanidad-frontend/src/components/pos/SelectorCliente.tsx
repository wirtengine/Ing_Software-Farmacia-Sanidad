import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, X, Search, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { useBuscarClientes, useCrearCliente } from '@/hooks/useVentas'
import { useCarritoStore } from '@/store/carritoStore'
import type { ClienteRequest } from '@/types/domain'

export function SelectorCliente() {
  const clienteSeleccionado = useCarritoStore((s) => s.clienteSeleccionado)
  const setCliente = useCarritoStore((s) => s.setCliente)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [nuevoCliente, setNuevoCliente] = useState<ClienteRequest>({ nombre: '', identificacion: '', telefono: '' })
  const [modoNuevo, setModoNuevo] = useState(false)

  const { data: resultados } = useBuscarClientes(query)
  const crearCliente = useCrearCliente()

  async function handleCrear() {
    const cliente = await crearCliente.mutateAsync(nuevoCliente)
    setCliente(cliente)
    setOpen(false)
    setModoNuevo(false)
    setNuevoCliente({ nombre: '', identificacion: '', telefono: '' })
  }

  if (clienteSeleccionado) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50 border border-sage-200">
        <div className="flex items-center gap-2 min-w-0">
          <User className="h-4 w-4 text-sage-600 shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-medium text-ink truncate">{clienteSeleccionado.nombre}</span>
        </div>
        <button onClick={() => setCliente(null)} aria-label="Quitar cliente">
          <X className="h-4 w-4 text-ink-subtle hover:text-ink" strokeWidth={1.75} />
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-border-strong text-sm text-ink-muted hover:border-sage-400 hover:text-sage-700 transition-colors"
      >
        <User className="h-4 w-4" strokeWidth={1.75} />
        Venta libre (sin cliente)
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Seleccionar cliente">
        {!modoNuevo ? (
          <div>
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" strokeWidth={1.75} />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o identificación…"
                className="pl-10"
              />
            </div>

            <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-1.5">
              <AnimatePresence>
                {resultados?.map((c) => (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setCliente(c)
                      setOpen(false)
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-surface-warm transition-colors"
                  >
                    <p className="text-sm font-medium text-ink">{c.nombre}</p>
                    {c.identificacion && <p className="text-xs text-ink-subtle">{c.identificacion}</p>}
                  </motion.button>
                ))}
              </AnimatePresence>
              {query && resultados?.length === 0 && (
                <p className="text-sm text-ink-muted text-center py-4">Sin resultados</p>
              )}
            </div>

            <Button variant="outline" className="w-full mt-3" onClick={() => setModoNuevo(true)}>
              <UserPlus className="h-4 w-4" strokeWidth={1.75} />
              Registrar cliente nuevo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="c-nombre">Nombre</Label>
              <Input
                id="c-nombre"
                autoFocus
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-identificacion">Identificación (opcional)</Label>
              <Input
                id="c-identificacion"
                value={nuevoCliente.identificacion}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, identificacion: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-telefono">Teléfono (opcional)</Label>
              <Input
                id="c-telefono"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModoNuevo(false)}>
                Volver
              </Button>
              <Button onClick={handleCrear} loading={crearCliente.isPending}>
                Guardar y usar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
