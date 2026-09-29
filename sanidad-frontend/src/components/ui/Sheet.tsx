import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { backdropVariants, slideFromLeft } from '@/lib/motion'
import { cn } from '@/lib/cn'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  side?: 'left' | 'right'
  className?: string
}

export function Sheet({ open, onClose, children, side = 'left', className }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
          />
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute top-0 bottom-0 w-72 bg-surface shadow-modal',
              side === 'left' ? 'left-0' : 'right-0',
              className
            )}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-surface-warm"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
