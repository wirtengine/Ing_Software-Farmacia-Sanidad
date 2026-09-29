import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('flex gap-1 bg-surface-warm p-1 rounded-lg relative', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger debe usarse dentro de Tabs')
  const isActive = ctx.value === value

  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        'relative px-4 py-2 text-sm font-medium rounded-md transition-colors z-10',
        isActive ? 'text-sage-700' : 'text-ink-muted hover:text-ink'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-indicator"
          className="absolute inset-0 bg-surface rounded-md shadow-soft -z-10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent debe usarse dentro de Tabs')
  if (ctx.value !== value) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4"
    >
      {children}
    </motion.div>
  )
}
