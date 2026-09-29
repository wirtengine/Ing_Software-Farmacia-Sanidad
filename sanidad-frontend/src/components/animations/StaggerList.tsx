import { motion } from 'framer-motion'
import { listContainer, listItem } from '@/lib/motion'
import type { ReactNode } from 'react'

interface StaggerListProps {
  children: ReactNode
  className?: string
}

export function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={listItem} className={className}>
      {children}
    </motion.div>
  )
}
