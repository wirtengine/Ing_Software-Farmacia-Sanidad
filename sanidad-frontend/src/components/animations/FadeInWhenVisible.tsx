import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInWhenVisibleProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeInWhenVisible({ children, className, delay = 0 }: FadeInWhenVisibleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
