import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useBuscarProductos } from '@/hooks/useProductos'
import { useProducto } from '@/hooks/useProductos'
import { formatCordobas, UNIDAD_LABELS } from '@/lib/format'
import type { ProductoBusqueda, ItemCarrito } from '@/types/domain'

interface BuscadorProductoProps {
  onSeleccionar: (item: ItemCarrito) => void
}

function ResultadoConUnidades({
  producto,
  onSeleccionar,
}: {
  producto: ProductoBusqueda
  onSeleccionar: (item: ItemCarrito) => void
}) {
  const { data: detalle } = useProducto(producto.id)

  if (!detalle?.unidades || detalle.unidades.length === 0) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-3 rounded-lg bg-surface-warm hover:bg-sage-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {detalle.imagenUrl ? (
            <img src={detalle.imagenUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint-100">
              <Package className="h-4 w-4 text-sage-600" strokeWidth={1.75} />
            </span>
          )}
          <span className="font-medium text-sm text-ink truncate">{producto.nombreComercial}</span>
        </div>
        {producto.requiereReceta && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-warning/20 text-warning shrink-0">
            Receta
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {detalle.unidades
          .filter((u) => u.activo)
          .map((u) => (
            <button
              key={u.id}
              onClick={() =>
                onSeleccionar({
                  productoId: producto.id,
                  productoNombre: producto.nombreComercial,
                  productoUnidadId: u.id,
                  unidad: u.unidad,
                  factorBase: u.factorBase,
                  cantidad: 1,
                  precioUnitario: u.precioVenta,
                })
              }
              className="text-xs bg-surface border border-border-soft rounded-md px-2.5 py-1.5 hover:border-sage-400 hover:bg-sage-50 transition-colors flex items-center gap-1.5"
            >
              <span className="font-medium">{UNIDAD_LABELS[u.unidad]}</span>
              <span className="text-sage-700 font-semibold">{formatCordobas(u.precioVenta)}</span>
            </button>
          ))}
      </div>
    </motion.div>
  )
}

export function BuscadorProducto({ onSeleccionar }: BuscadorProductoProps) {
  const [query, setQuery] = useState('')
  const { data: resultados, isFetching } = useBuscarProductos(query)

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" strokeWidth={1.75} />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá por nombre o código…"
          className="pl-10"
        />
      </div>

      <div className="mt-3 max-h-[420px] overflow-y-auto scrollbar-thin space-y-2">
        <AnimatePresence mode="popLayout">
          {isFetching && (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-ink-subtle text-center py-4"
            >
              Buscando…
            </motion.p>
          )}
          {!isFetching && query && resultados?.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-ink-muted text-center py-8"
            >
              No encontramos nada con ese nombre
            </motion.p>
          )}
          {resultados
            ?.filter((p) => p.activo)
            .map((producto) => (
              <ResultadoConUnidades
                key={producto.id}
                producto={producto}
                onSeleccionar={onSeleccionar}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
