import { motion } from 'framer-motion'
import { Boxes } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { EstanteCriticoDto } from '@/types/domain'

interface ProductosCriticosTableProps {
  data: EstanteCriticoDto[]
}

export function ProductosCriticosTable({ data }: ProductosCriticosTableProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-terracotta-500" strokeWidth={1.75} />
            Estantes con más productos críticos
          </CardTitle>
        </CardHeader>

        {data.length === 0 ? (
          <p className="text-sm text-ink-muted py-4 text-center">Sin estantes críticos por ahora</p>
        ) : (
          <div className="space-y-2">
            {data.map((e, i) => (
              <div key={e.estanteId} className="flex items-center gap-3">
                <span className="font-mono text-sm text-ink w-16 shrink-0">{e.estanteCodigo}</span>
                <div className="flex-1 h-2 bg-surface-warm rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (e.cantidadProductosCriticos / (data[0]?.cantidadProductosCriticos || 1)) * 100)}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-terracotta-500 rounded-full"
                  />
                </div>
                <span className="text-xs text-ink-muted w-6 text-right shrink-0">
                  {e.cantidadProductosCriticos}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
