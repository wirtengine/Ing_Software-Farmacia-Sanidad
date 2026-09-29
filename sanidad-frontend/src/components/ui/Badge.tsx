import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'warning' | 'danger' | 'info' | 'neutral'
}

const variantClasses: Record<string, string> = {
  sage: 'bg-mint-100 text-sage-700',
  warning: 'bg-butter-100 text-[#9A6B12]',
  danger: 'bg-blush-100 text-blush-500',
  info: 'bg-sky-100 text-sky-500',
  neutral: 'bg-lavender-50 text-ink-muted',
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  return (
    <motion.span
      key={String(children)}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.span>
  )
}
