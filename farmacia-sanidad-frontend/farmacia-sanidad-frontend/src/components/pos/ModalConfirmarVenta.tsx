import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { AnimatedCheck } from '@/components/animations/AnimatedCheck'
import { formatCordobas } from '@/lib/format'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalConfirmarVentaProps {
  open: boolean
  onClose: () => void
  total: number
  onConfirmar: (montoRecibido: number) => Promise<void>
  ventaCompletada: boolean
}

export function ModalConfirmarVenta({
  open,
  onClose,
  total,
  onConfirmar,
  ventaCompletada,
}: ModalConfirmarVentaProps) {
  const [monto, setMonto] = useState(total.toFixed(2))
  const [procesando, setProcesando] = useState(false)

  const montoNum = parseFloat(monto) || 0
  const vuelto = montoNum - total

  async function handleConfirmar() {
    setProcesando(true)
    try {
      await onConfirmar(montoNum)
    } finally {
      setProcesando(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={ventaCompletada ? undefined : 'Confirmar venta'}>
      <AnimatePresence mode="wait">
        {ventaCompletada ? (
          <motion.div
            key="exito"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <AnimatedCheck size={80} />
            <h3 className="font-serif text-xl text-ink mt-4">¡Venta completada!</h3>
            <p className="text-sm text-ink-muted mt-1">La venta se registró sin problemas</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between text-sm p-3 rounded-lg bg-surface-warm">
              <span className="text-ink-muted">Total a pagar</span>
              <span className="font-semibold text-sage-700">{formatCordobas(total)}</span>
            </div>

            <div>
              <Label htmlFor="montoRecibido">Monto recibido (córdobas)</Label>
              <Input
                id="montoRecibido"
                type="number"
                step="0.01"
                autoFocus
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>

            <div
              className={`flex justify-between text-sm p-3 rounded-lg ${
                vuelto < 0 ? 'bg-danger/10' : 'bg-sage-50'
              }`}
            >
              <span className="text-ink-muted">Vuelto</span>
              <span className={`font-semibold ${vuelto < 0 ? 'text-danger' : 'text-sage-700'}`}>
                {formatCordobas(Math.max(vuelto, 0))}
              </span>
            </div>
            {vuelto < 0 && (
              <p className="text-xs text-danger -mt-2">El monto recibido es menor al total</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmar} loading={procesando} disabled={vuelto < 0}>
                Confirmar venta
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
