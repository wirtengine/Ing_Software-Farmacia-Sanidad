import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { listContainer, listItem } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ columns, data, keyExtractor, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-soft bg-surface">
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="border-b border-border-soft">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 font-medium text-ink-muted text-xs uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody initial="hidden" animate="visible" variants={listContainer}>
          {data.map((row) => (
            <motion.tr
              key={keyExtractor(row)}
              variants={listItem}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border-soft last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-surface-warm'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-ink', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={listContainer}
        className="md:hidden divide-y divide-border-soft"
      >
        {data.map((row) => (
          <motion.div
            key={keyExtractor(row)}
            variants={listItem}
            onClick={() => onRowClick?.(row)}
            className={cn('p-4 space-y-1.5', onRowClick && 'cursor-pointer active:bg-surface-warm')}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between gap-3 text-sm">
                <span className="text-ink-subtle text-xs uppercase tracking-wide shrink-0 pt-0.5">
                  {col.header}
                </span>
                <span className="text-ink text-right">{col.render(row)}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
