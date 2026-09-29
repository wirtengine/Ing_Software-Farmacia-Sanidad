import { Badge } from '@/components/ui/Badge'

export function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <Badge variant={activo ? 'sage' : 'neutral'}>
      {activo ? 'Activo' : 'Inactivo'}
    </Badge>
  )
}
