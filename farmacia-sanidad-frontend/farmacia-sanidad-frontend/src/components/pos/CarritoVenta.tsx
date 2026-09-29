import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCarritoStore } from '@/store/carritoStore'
import { formatCordobas, UNIDAD_LABELS } from '@/lib/format'

export function CarritoVenta() {
  const items = useCarritoStore((s) => s.items)
  const actualizarCantidad = useCarritoStore((s) => s.actualizarCantidad)
  const quitarItem = useCarritoStore((s) => s.quitarItem)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-sage-100 flex items-center justify-center mb-3">
          <ShoppingCart className="h-6 w-6 text-sage-600" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-ink-muted">El carrito está vacío</p>
        <p className="text-xs text-ink-subtle mt-1">Buscá un producto para empezar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.productoUnidadId}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-warm overflow-hidden"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{item.productoNombre}</p>
              <p className="text-xs text-ink-subtle">
                {UNIDAD_LABELS[item.unidad]} · {formatCordobas(item.precioUnitario)} c/u
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-surface rounded-lg border border-border-soft">
              <button
                onClick={() => actualizarCantidad(item.productoUnidadId, item.cantidad - 1)}
                className="p-1.5 text-ink-muted hover:text-ink"
                aria-label="Restar"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.productoUnidadId, item.cantidad + 1)}
                className="p-1.5 text-ink-muted hover:text-ink"
                aria-label="Sumar"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <span className="text-sm font-semibold text-sage-700 w-20 text-right shrink-0">
              {formatCordobas(item.cantidad * item.precioUnitario)}
            </span>

            <button
              onClick={() => quitarItem(item.productoUnidadId)}
              className="text-ink-subtle hover:text-danger transition-colors shrink-0"
              aria-label="Quitar del carrito"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
