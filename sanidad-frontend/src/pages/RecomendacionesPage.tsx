import { TrendingUp, Check, X } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StaggerList, StaggerItem } from '@/components/animations/StaggerList'
import { useRecomendaciones, useGestionarRecomendacion } from '@/hooks/useRecomendaciones'
import { formatNumero } from '@/lib/format'

const tipoLabels: Record<string, string> = {
  COMPRA: 'Comprar más',
  LIQUIDACION: 'Liquidar',
  DESCONTINUACION: 'Descontinuar',
}

const tipoVariant: Record<string, 'sage' | 'warning' | 'danger'> = {
  COMPRA: 'sage',
  LIQUIDACION: 'warning',
  DESCONTINUACION: 'danger',
}

export function RecomendacionesPage() {
  const { data: recomendaciones, isLoading } = useRecomendaciones()
  const gestionar = useGestionarRecomendacion()

  return (
    <div>
      <PageHeader title="Recomendaciones" description="Sugerencias automáticas basadas en tus ventas" />

      {isLoading ? (
        <p className="text-sm text-ink-muted">Cargando…</p>
      ) : !recomendaciones || recomendaciones.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Sin recomendaciones por ahora" description="Necesitamos más historial de ventas para generar sugerencias." />
      ) : (
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recomendaciones.map((r) => (
            <StaggerItem key={r.id}>
              <div className="bg-surface rounded-xl border border-border-soft shadow-soft p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-base text-ink">{r.productoNombre}</h3>
                  <Badge variant={tipoVariant[r.tipo]}>{tipoLabels[r.tipo]}</Badge>
                </div>
                <p className="text-sm text-ink-muted mb-3">{r.motivo}</p>
                <div className="grid grid-cols-2 gap-3 text-xs text-ink-subtle mb-4">
                  {r.coberturaDias !== undefined && (
                    <div>
                      <span className="block text-ink-subtle">Cobertura</span>
                      <span className="text-ink font-medium">{formatNumero(r.coberturaDias)} días</span>
                    </div>
                  )}
                  {r.unidadesVendidas60d !== undefined && (
                    <div>
                      <span className="block text-ink-subtle">Vendido en 60d</span>
                      <span className="text-ink font-medium">{formatNumero(r.unidadesVendidas60d)}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => gestionar.mutate({ id: r.id, data: { estado: 'GESTIONADA' } })}
                  >
                    <Check className="h-4 w-4" strokeWidth={1.75} />
                    Gestionar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-ink-muted"
                    onClick={() => gestionar.mutate({ id: r.id, data: { estado: 'DESCARTADA' } })}
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                    Descartar
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  )
}
