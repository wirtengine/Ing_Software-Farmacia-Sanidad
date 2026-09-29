import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          className={cn(
            'w-full h-11 px-4 rounded-xl bg-white/90 border focus:border-sage-300 focus:shadow-glow text-ink text-sm placeholder:text-ink-subtle',
            'transition-colors outline-none',
            error ? 'border-danger' : 'border-border-soft',
            className
          )}
          {...props}
        />
        <motion.div
          className={cn(
            'absolute bottom-0 left-1/2 h-0.5 rounded-full',
            error ? 'bg-danger' : 'bg-sage-500'
          )}
          initial={{ scaleX: 0, x: '-50%' }}
          animate={{ scaleX: focused ? 1 : 0, x: '-50%' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', transformOrigin: 'center' }}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'
