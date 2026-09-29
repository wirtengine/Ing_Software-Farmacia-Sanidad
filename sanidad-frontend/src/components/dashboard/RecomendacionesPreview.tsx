import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRecomendaciones } from '@/hooks/useRecomendaciones'

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

export function RecomendacionesPreview() {
  const { data: recomendaciones } = useRecomendaciones()
  const top = recomendaciones?.slice(0, 5) ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card>
        <CardHeader className="flex-row items-center justify-between mb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sage-600" strokeWidth={1.75} />
            Recomendaciones
          </CardTitle>
          <Link to="/recomendaciones" className="text-xs text-sage-600 hover:text-sage-700 flex items-center gap-0.5">
            Ver todas <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
        </CardHeader>

        {top.length === 0 ? (
          <p className="text-sm text-ink-muted py-4 text-center">Sin recomendaciones por ahora</p>
        ) : (
          <div className="space-y-2">
            {top.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-warm">
                <p className="text-sm text-ink truncate">{r.productoNombre}</p>
                <Badge variant={tipoVariant[r.tipo]} className="shrink-0 ml-2">
                  {tipoLabels[r.tipo]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
