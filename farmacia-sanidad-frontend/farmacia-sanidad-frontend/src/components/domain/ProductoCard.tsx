import { motion } from 'framer-motion'
import { Package, Pill, FileWarning, MapPin } from 'lucide-react'
import type { Producto } from '@/types/domain'
import { formatCordobas, UNIDAD_LABELS } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

const fondos = ['from-mint-100 to-sky-50', 'from-lavender-100 to-blush-50', 'from-blush-100 to-butter-50', 'from-sky-100 to-mint-50', 'from-butter-100 to-lavender-50']

export function ProductoCard({ producto, onClick }: { producto: Producto; onClick: (p: Producto) => void }) {
  const fondo = fondos[producto.codigoInterno.length % fondos.length]
  return (
    <motion.button
      layout
      onClick={() => onClick(producto)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group tarjeta-vidrio w-full overflow-hidden rounded-2xl text-left transition-shadow hover:shadow-modal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
    >
      <div className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${fondo}`}>
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.nombreComercial} loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-soft">
            {producto.tipoProducto === 'MEDICAMENTO'
              ? <Pill className="h-8 w-8 text-sage-500" strokeWidth={1.5} />
              : <Package className="h-8 w-8 text-lavender-500" strokeWidth={1.5} />}
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {producto.requiereReceta && (
            <Badge variant="warning"><FileWarning className="h-3 w-3" strokeWidth={1.75} /> Receta</Badge>
          )}
          {!producto.activo && <Badge variant="neutral">Inactivo</Badge>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-serif text-base text-ink">{producto.nombreComercial}</h3>
        <p className="line-clamp-1 text-xs text-ink-subtle">{producto.nombreGenerico || producto.presentacion || producto.categoria || '—'}</p>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-wrap gap-1">
            {producto.unidadBase && <Badge variant="sage">{UNIDAD_LABELS[producto.unidadBase]}</Badge>}
            {producto.estanteCodigo && (
              <Badge variant="info"><MapPin className="h-3 w-3" strokeWidth={1.75} />{producto.estanteCodigo}</Badge>
            )}
          </div>
          <span className="font-semibold text-sage-700">{formatCordobas(producto.precioVenta)}</span>
        </div>
      </div>
    </motion.button>
  )
}
