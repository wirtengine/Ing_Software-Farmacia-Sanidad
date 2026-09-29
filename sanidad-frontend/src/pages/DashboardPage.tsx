import { DollarSign, ShoppingBag, Package, AlertTriangle, Bell, TrendingUp, Receipt, CalendarClock } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { VentasChart } from '@/components/dashboard/VentasChart'
import { AlertasPreview } from '@/components/dashboard/AlertasPreview'
import { RecomendacionesPreview } from '@/components/dashboard/RecomendacionesPreview'
import { ProductosCriticosTable } from '@/components/dashboard/ProductosCriticosTable'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCordobas } from '@/lib/format'

export function DashboardPage() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-72" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Panel del día" description="Así va Farmacia Sanidad hoy" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="Ventas de hoy" value={Number(data.ventasHoy)} formatter={formatCordobas} variant="sage" delay={0} />
        <KpiCard icon={ShoppingBag} label="Ventas del mes" value={Number(data.ventasMes)} formatter={formatCordobas} variant="lavender" delay={0.05} />
        <KpiCard icon={Receipt} label="Tickets de hoy" value={data.cantidadVentasHoy} variant="info" delay={0.1} />
        <KpiCard icon={Package} label="Productos activos" value={data.productosActivos} variant="sage" delay={0.15} />
        <KpiCard icon={AlertTriangle} label="Stock crítico" value={data.productosStockCritico} variant="danger" delay={0.2} />
        <KpiCard icon={CalendarClock} label="Lotes por vencer" value={data.lotesProximosAVencer} variant="warning" delay={0.25} />
        <KpiCard icon={Bell} label="Alertas activas" value={data.alertasActivas} variant="danger" delay={0.3} />
        <KpiCard icon={TrendingUp} label="Recomendaciones" value={data.recomendacionesActivas} variant="lavender" delay={0.35} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <VentasChart data={(data.ventasUltimos7Dias ?? []).map((d) => ({ fecha: d.fecha, total: Number(d.total) }))} />
          <AlertasPreview />
        </div>
        <div className="space-y-6">
          <RecomendacionesPreview />
          <ProductosCriticosTable data={data.topEstantesConProductosCriticos} />
        </div>
      </div>
    </div>
  )
}
