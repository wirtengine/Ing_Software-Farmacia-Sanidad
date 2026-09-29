import { useState } from 'react'
import { QrCode, Download } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { SearchInput } from '@/components/common/SearchInput'
import { useProductos } from '@/hooks/useProductos'
import { useProducto } from '@/hooks/useProductos'
import { qrService } from '@/api/qrService'
import { UNIDAD_LABELS } from '@/lib/format'
import { motion } from 'framer-motion'

export function QRPage() {
  const { data: productos } = useProductos()
  const [productoId, setProductoId] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const { data: producto } = useProducto(productoId ?? undefined)

  const filtrados = (productos ?? []).filter((p) =>
    p.nombreComercial.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Códigos QR" description="Generá e imprimí códigos QR por unidad de venta" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar producto…" />
          <div className="mt-3 max-h-96 overflow-y-auto scrollbar-thin space-y-1.5">
            {filtrados.map((p) => (
              <button
                key={p.id}
                onClick={() => setProductoId(p.id)}
                className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${
                  productoId === p.id ? 'bg-sage-100 text-sage-700' : 'hover:bg-surface-warm text-ink'
                }`}
              >
                {p.nombreComercial}
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          {!producto ? (
            <EmptyState icon={QrCode} title="Elegí un producto" description="Seleccioná un producto de la lista para ver sus códigos QR." />
          ) : !producto.unidades || producto.unidades.length === 0 ? (
            <EmptyState icon={QrCode} title="Sin unidades de venta" description="Este producto no tiene unidades configuradas." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {producto.unidades.filter((u) => u.activo).map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-warm"
                >
                  <img
                    src={qrService.urlQrUnidad(producto.id, u.id)}
                    alt={`QR de ${UNIDAD_LABELS[u.unidad]}`}
                    className="h-32 w-32 rounded-lg bg-white p-2"
                  />
                  <p className="text-xs font-medium text-ink">{UNIDAD_LABELS[u.unidad]}</p>
                  <a
                    href={qrService.urlQrUnidad(producto.id, u.id)}
                    download={`qr-${producto.codigoInterno}-${u.unidad}.png`}
                    className="text-xs text-sage-600 hover:text-sage-700 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" strokeWidth={1.75} />
                    Descargar
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
