import { motion } from 'framer-motion'

interface AnimatedCheckProps {
  size?: number
  className?: string
}

export function AnimatedCheck({ size = 96, className }: AnimatedCheckProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        stroke="#7BAE7F"
        strokeWidth="4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M30 48L42 60L66 36"
        stroke="#7BAE7F"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
