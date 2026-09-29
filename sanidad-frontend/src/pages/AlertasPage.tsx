import { Bell, RefreshCw, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StaggerList, StaggerItem } from '@/components/animations/StaggerList'
import { AnimatePresence } from 'framer-motion'
import { useAlertas, useResolverAlerta, useGenerarAlertas } from '@/hooks/useAlertas'
import { useAuthStore } from '@/store/authStore'
import { formatFechaHora } from '@/lib/format'

const tipoLabels: Record<string, string> = {
  STOCK_CRITICO: 'Stock crítico',
  VENCIMIENTO_PROXIMO: 'Próximo a vencer',
}

export function AlertasPage() {
  const { data: alertas, isLoading } = useAlertas()
  const resolver = useResolverAlerta()
  const generar = useGenerarAlertas()
  const hasRole = useAuthStore((s) => s.hasRole)

  return (
    <div>
      <PageHeader
        title="Alertas"
        description="Stock crítico y productos próximos a vencer"
        actions={
          hasRole('ADMIN') && (
            <Button variant="outline" onClick={() => generar.mutate()} loading={generar.isPending}>
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
              Generar ahora
            </Button>
          )
        }
      />

      {isLoading ? (
        <p className="text-sm text-ink-muted">Cargando…</p>
      ) : !alertas || alertas.length === 0 ? (
        <EmptyState icon={Bell} title="Todo tranquilo por aquí" description="No hay alertas activas en este momento." />
      ) : (
        <StaggerList className="space-y-2">
          <AnimatePresence>
            {alertas.map((a) => (
              <StaggerItem key={a.id}>
                <div
                  className={`flex items-center justify-between p-4 rounded-xl bg-surface border shadow-soft ${
                    a.tipo === 'STOCK_CRITICO'
                      ? 'border-danger/30 animate-pulse-soft'
                      : 'border-warning/30'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-ink truncate">{a.productoNombre}</span>
                      <Badge variant={a.tipo === 'STOCK_CRITICO' ? 'danger' : 'warning'}>
                        {tipoLabels[a.tipo]}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-muted">{a.mensaje}</p>
                    <p className="text-xs text-ink-subtle mt-0.5">{formatFechaHora(a.fechaGeneracion)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resolver.mutate(a.id)}
                    className="text-sage-600 shrink-0 ml-3"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    Resolver
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerList>
      )}
    </div>
  )
}
