import { CountUp } from '@/components/animations/CountUp'
import { formatCordobas } from '@/lib/format'
import { useCarritoStore } from '@/store/carritoStore'

export function ResumenVenta() {
  const total = useCarritoStore((s) => s.total())

  return (
    <div className="flex items-center justify-between py-4 border-t border-border-soft">
      <span className="font-serif text-lg text-ink">Total</span>
      <CountUp
        value={total}
        formatter={formatCordobas}
        className="font-serif text-2xl text-sage-700 font-medium"
      />
    </div>
  )
}
