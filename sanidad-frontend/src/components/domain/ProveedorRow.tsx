import { Phone, Mail } from 'lucide-react'
import type { Proveedor } from '@/types/domain'

export function ProveedorContacto({ proveedor }: { proveedor: Proveedor }) {
  return (
    <div className="space-y-0.5">
      {proveedor.telefono && (
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Phone className="h-3 w-3" strokeWidth={1.75} />
          {proveedor.telefono}
        </div>
      )}
      {proveedor.correoElectronico && (
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Mail className="h-3 w-3" strokeWidth={1.75} />
          {proveedor.correoElectronico}
        </div>
      )}
    </div>
  )
}
