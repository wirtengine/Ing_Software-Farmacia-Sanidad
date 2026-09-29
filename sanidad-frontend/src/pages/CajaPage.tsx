import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, LogIn, LogOut } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Dialog } from '@/components/ui/Dialog'
import { CountUp } from '@/components/animations/CountUp'
import { useCajaActual, useAbrirCaja, useCerrarCaja } from '@/hooks/useCaja'
import { useAuthStore } from '@/store/authStore'
import { formatCordobas, formatFechaHora } from '@/lib/format'

export function CajaPage() {
  const { data: caja, isLoading } = useCajaActual()
  const abrir = useAbrirCaja()
  const cerrar = useCerrarCaja()
  const esAdmin = useAuthStore((st) => st.hasRole('ADMIN'))

  const [dialogAbrir, setDialogAbrir] = useState(false)
  const [dialogCerrar, setDialogCerrar] = useState(false)
  const [montoInicial, setMontoInicial] = useState('0')
  const [montoFinal, setMontoFinal] = useState('0')

  async function handleAbrir() {
    await abrir.mutateAsync({ montoInicial: parseFloat(montoInicial) || 0 })
    setDialogAbrir(false)
  }

  async function handleCerrar() {
    if (!caja) return
    await cerrar.mutateAsync({ id: caja.id, data: { montoFinalReal: parseFloat(montoFinal) || 0 } })
    setDialogCerrar(false)
  }

  if (isLoading) {
    return <div className="text-center py-20 text-ink-muted">Cargando…</div>
  }

  return (
    <div>
      <PageHeader title="Caja" description="Apertura y cierre de tu caja del día" />

      {!caja ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="max-w-md mx-auto text-center py-10">
            <div className="h-14 w-14 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-7 w-7 text-sage-600" strokeWidth={1.75} />
            </div>
            <h3 className="font-serif text-lg text-ink mb-1">La caja está cerrada</h3>
            <p className="text-sm text-ink-muted mb-6">
              {esAdmin ? 'Abrí la caja para empezar a vender hoy.' : 'Pedile a un administrador que abra la caja del día.'}
            </p>
            {esAdmin && (
              <Button onClick={() => setDialogAbrir(true)}>
                <LogIn className="h-4 w-4" strokeWidth={1.75} />
                Abrir caja
              </Button>
            )}
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <p className="text-xs text-ink-subtle uppercase tracking-wide mb-1">Caja abierta por {caja.usuarioAperturaNombre}</p>
              <p className="text-sm text-ink-muted">{formatFechaHora(caja.fechaApertura)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-surface-warm">
                <p className="text-xs text-ink-subtle mb-1">Monto inicial</p>
                <CountUp
                  value={caja.montoInicial}
                  formatter={formatCordobas}
                  className="font-serif text-xl text-ink"
                />
              </div>
              <div className="text-center p-4 rounded-xl bg-sage-50">
                <p className="text-xs text-ink-subtle mb-1">Ventas en efectivo</p>
                <CountUp
                  value={caja.totalVentasEfectivo ?? 0}
                  formatter={formatCordobas}
                  className="font-serif text-xl text-sage-700"
                />
              </div>
            </div>

            <Button variant="danger" className="w-full" onClick={() => setDialogCerrar(true)}>
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Cerrar caja
            </Button>
          </Card>
        </motion.div>
      )}

      <Dialog open={dialogAbrir} onClose={() => setDialogAbrir(false)} title="Abrir caja">
        <div className="space-y-4">
          <div>
            <Label htmlFor="montoInicial">Monto inicial (córdobas)</Label>
            <Input
              id="montoInicial"
              type="number"
              step="0.01"
              autoFocus
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogAbrir(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAbrir} loading={abrir.isPending}>
              Abrir caja
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={dialogCerrar} onClose={() => setDialogCerrar(false)} title="Cerrar caja">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Contá el efectivo físico en caja e ingresá el monto real.
          </p>
          <div>
            <Label htmlFor="montoFinal">Monto final real (córdobas)</Label>
            <Input
              id="montoFinal"
              type="number"
              step="0.01"
              autoFocus
              value={montoFinal}
              onChange={(e) => setMontoFinal(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogCerrar(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleCerrar} loading={cerrar.isPending}>
              Cerrar caja
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
