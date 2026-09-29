import { motion } from 'framer-motion'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCordobas, formatFechaHora } from '@/lib/format'
import type { ComprobanteResponse } from '@/types/domain'

export function ComprobanteVenta({ comprobante }: { comprobante: ComprobanteResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border-soft p-6 font-mono text-sm max-w-sm mx-auto"
    >
      <div className="text-center mb-4">
        <h3 className="font-serif text-lg text-ink not-italic">Farmacia Sanidad</h3>
        <p className="text-xs text-ink-subtle">
          Comprobante N.° {comprobante.numeroComprobante ?? '—'}
        </p>
        <p className="text-xs text-ink-subtle">{formatFechaHora(comprobante.fecha)}</p>
      </div>

      <div className="border-t border-dashed border-border-strong my-3" />

      <p className="text-xs text-ink-muted mb-2">
        Cliente: {comprobante.clienteNombre ?? 'Venta libre'}
      </p>
      <p className="text-xs text-ink-muted mb-3">Vendedor: {comprobante.vendedorNombre}</p>

      <div className="space-y-1.5">
        {comprobante.items.map((item, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="truncate pr-2">
              {item.cantidad}x {item.nombreProducto}
            </span>
            <span className="shrink-0">{formatCordobas(item.subtotal ?? 0)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-border-strong my-3" />

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span className="text-sage-700">{formatCordobas(comprobante.total)}</span>
      </div>
      {comprobante.montoRecibido !== undefined && (
        <>
          <div className="flex justify-between text-xs text-ink-muted mt-1">
            <span>Recibido</span>
            <span>{formatCordobas(comprobante.montoRecibido)}</span>
          </div>
          <div className="flex justify-between text-xs text-ink-muted">
            <span>Vuelto</span>
            <span>{formatCordobas(comprobante.vuelto ?? 0)}</span>
          </div>
        </>
      )}

      <Button variant="outline" className="w-full mt-5" onClick={() => window.print()}>
        <Printer className="h-4 w-4" strokeWidth={1.75} />
        Imprimir
      </Button>
    </motion.div>
  )
}
