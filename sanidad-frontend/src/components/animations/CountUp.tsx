import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

interface CountUpProps {
  value: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
}

export function CountUp({ value, duration = 0.8, formatter, className }: CountUpProps) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => {
    const rendered = Math.round(latest * 100) / 100
    return formatter ? formatter(rendered) : rendered.toString()
  })
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    prevValue.current = value
    return controls.stop
  }, [value, duration, motionValue])

  return <motion.span className={className}>{rounded}</motion.span>
}
