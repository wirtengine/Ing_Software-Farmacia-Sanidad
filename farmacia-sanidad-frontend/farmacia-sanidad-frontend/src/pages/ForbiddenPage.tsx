import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="h-16 w-16 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 text-warning" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-2xl text-ink mb-2">No tenés acceso aquí</h1>
        <p className="text-sm text-ink-muted mb-6">
          Tu rol no tiene permiso para ver esta sección. Si creés que es un error, hablá con un administrador.
        </p>
        <Link to="/">
          <Button>Volver al panel</Button>
        </Link>
      </motion.div>
    </div>
  )
}
