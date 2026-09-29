import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { CountUp } from '@/components/animations/CountUp'
import { cn } from '@/lib/cn'

interface KpiCardProps {
  icon: LucideIcon
  label: string
  value: number
  formatter?: (v: number) => string
  variant?: 'sage' | 'warning' | 'danger' | 'info' | 'lavender'
  delay?: number
}

const estilos: Record<string, { fondo: string; icono: string }> = {
  sage: { fondo: 'from-mint-100/90 to-white', icono: 'bg-mint-200 text-sage-700' },
  warning: { fondo: 'from-butter-100/90 to-white', icono: 'bg-butter-200 text-[#9A6B12]' },
  danger: { fondo: 'from-blush-100/90 to-white', icono: 'bg-blush-200 text-blush-500' },
  info: { fondo: 'from-sky-100/90 to-white', icono: 'bg-sky-200 text-sky-500' },
  lavender: { fondo: 'from-lavender-100/90 to-white', icono: 'bg-lavender-200 text-lavender-500' },
}

export function KpiCard({ icon: Icon, label, value, formatter, variant = 'sage', delay = 0 }: KpiCardProps) {
  const e = estilos[variant]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border border-white/80 bg-gradient-to-br p-5 shadow-card', e.fondo)}
    >
      <div className="flex items-center gap-4">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', e.icono)}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
          <CountUp value={value} formatter={formatter} className="block truncate font-serif text-2xl text-ink" />
        </div>
      </div>
    </motion.div>
  )
}
