import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="h-16 w-16 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-6">
          <Compass className="h-8 w-8 text-sage-600" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-2xl text-ink mb-2">Página no encontrada</h1>
        <p className="text-sm text-ink-muted mb-6">
          Parece que esta ruta no existe o se movió de lugar.
        </p>
        <Link to="/">
          <Button>Volver al panel</Button>
        </Link>
      </motion.div>
    </div>
  )
}
