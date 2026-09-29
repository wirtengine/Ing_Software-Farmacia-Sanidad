import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { backdropVariants, scaleIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

export function Dialog({ open, onClose, children, title, className }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative bg-surface rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-border-soft">
                <h2 className="font-serif text-xl text-ink">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="text-ink-muted hover:text-ink transition-colors rounded-lg p-1 hover:bg-surface-warm"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
