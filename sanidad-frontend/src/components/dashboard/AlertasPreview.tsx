import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAlertas } from '@/hooks/useAlertas'

const tipoLabels: Record<string, string> = {
  STOCK_CRITICO: 'Stock crítico',
  VENCIMIENTO_PROXIMO: 'Próximo a vencer',
}

export function AlertasPreview() {
  const { data: alertas } = useAlertas()
  const top = alertas?.slice(0, 5) ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader className="flex-row items-center justify-between mb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-warning" strokeWidth={1.75} />
            Alertas activas
          </CardTitle>
          <Link to="/alertas" className="text-xs text-sage-600 hover:text-sage-700 flex items-center gap-0.5">
            Ver todas <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
        </CardHeader>

        {top.length === 0 ? (
          <p className="text-sm text-ink-muted py-4 text-center">Todo tranquilo por aquí</p>
        ) : (
          <div className="space-y-2">
            {top.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-warm">
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">{a.productoNombre}</p>
                  <p className="text-xs text-ink-subtle truncate">{a.mensaje}</p>
                </div>
                <Badge variant={a.tipo === 'STOCK_CRITICO' ? 'danger' : 'warning'} className="shrink-0 ml-2">
                  {tipoLabels[a.tipo]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
