import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-border-soft rounded-lg animate-pulse-soft', className)}
    />
  )
}
