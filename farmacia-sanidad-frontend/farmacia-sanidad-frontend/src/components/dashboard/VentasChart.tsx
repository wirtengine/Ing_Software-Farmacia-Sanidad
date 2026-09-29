import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCordobas } from '@/lib/format'

interface VentasChartProps {
  data: { fecha: string; total: number }[]
}

export function VentasChart({ data }: VentasChartProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle>Ventas de la semana</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5F8963" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5F8963" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D6" vertical={false} />
            <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#9A948A' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: '#9A948A' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `C$${v}`}
            />
            <Tooltip
              formatter={(value: number) => formatCordobas(value)}
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #E8E2D6',
                borderRadius: '12px',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#5F8963"
              strokeWidth={2.5}
              fill="url(#ventasGradient)"
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
