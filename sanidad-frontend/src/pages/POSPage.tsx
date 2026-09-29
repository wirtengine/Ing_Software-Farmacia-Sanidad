import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { BuscadorProducto } from '@/components/pos/BuscadorProducto'
import { CarritoVenta } from '@/components/pos/CarritoVenta'
import { SelectorCliente } from '@/components/pos/SelectorCliente'
import { ResumenVenta } from '@/components/pos/ResumenVenta'
import { ModalConfirmarVenta } from '@/components/pos/ModalConfirmarVenta'
import { useCarritoStore } from '@/store/carritoStore'
import { useCajaActual } from '@/hooks/useCaja'
import { useCrearVenta } from '@/hooks/useVentas'
import { ShoppingCart, Wallet } from 'lucide-react'

export function POSPage() {
  const navigate = useNavigate()
  const { data: caja, isLoading: cargandoCaja } = useCajaActual()
  const items = useCarritoStore((s) => s.items)
  const clienteSeleccionado = useCarritoStore((s) => s.clienteSeleccionado)
  const total = useCarritoStore((s) => s.total())
  const limpiar = useCarritoStore((s) => s.limpiar)
  const agregarItem = useCarritoStore((s) => s.agregarItem)

  const crearVenta = useCrearVenta()
  const [modalOpen, setModalOpen] = useState(false)
  const [ventaCompletada, setVentaCompletada] = useState(false)

  if (cargandoCaja) {
    return <div className="text-center py-20 text-ink-muted">Cargando…</div>
  }

  if (!caja) {
    return (
      <EmptyState
        icon={Wallet}
        title="La caja todavía está cerrada"
        description="Para registrar ventas, un administrador debe abrir la caja del día."
        action={<Button onClick={() => navigate('/caja')}>Ir a caja</Button>}
      />
    )
  }

  async function confirmarVenta(montoRecibido: number) {
    if (!caja) return
    try {
      const venta = await crearVenta.mutateAsync({
        clienteId: clienteSeleccionado?.id,
        cajaId: caja.id,
        montoRecibido,
        detalles: items.map((i) => ({
          productoId: i.productoId,
          productoUnidadId: i.productoUnidadId,
          cantidad: i.cantidad,
        })),
      })
      setVentaCompletada(true)
      setTimeout(() => {
        limpiar()
        setModalOpen(false)
        setVentaCompletada(false)
        if (venta.id) navigate(`/ventas/${venta.id}`)
      }, 1500)
    } catch {
      toast.error('No se pudo completar la venta')
    }
  }

  return (
    <div>
      <PageHeader title="Punto de venta" description="Registrá una nueva venta" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h3 className="font-serif text-base text-ink mb-4">Buscar producto</h3>
          <BuscadorProducto onSeleccionar={agregarItem} />
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <h3 className="font-serif text-base text-ink mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
            Carrito
          </h3>

          <div className="mb-4">
            <SelectorCliente />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin max-h-96">
            <CarritoVenta />
          </div>

          <ResumenVenta />

          <Button
            className="w-full mt-2"
            size="lg"
            disabled={items.length === 0}
            onClick={() => setModalOpen(true)}
          >
            Cobrar {items.length > 0 && `(${items.length})`}
          </Button>
        </Card>
      </div>

      <ModalConfirmarVenta
        open={modalOpen}
        onClose={() => !ventaCompletada && setModalOpen(false)}
        total={total}
        onConfirmar={confirmarVenta}
        ventaCompletada={ventaCompletada}
      />
    </div>
  )
}
