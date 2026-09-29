import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantClasses: Record<string, string> = {
  primary: 'bg-gradient-to-br from-sage-400 to-sage-600 text-white hover:from-sage-500 hover:to-sage-700 shadow-soft',
  secondary: 'bg-mint-100 text-sage-700 hover:bg-mint-200',
  outline: 'border border-border-strong bg-white/70 text-ink hover:bg-sage-50 hover:border-sage-300',
  ghost: 'text-ink hover:bg-sage-50',
  danger: 'bg-gradient-to-br from-blush-300 to-blush-500 text-white hover:to-danger',
}

const sizeClasses: Record<string, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as any)}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
