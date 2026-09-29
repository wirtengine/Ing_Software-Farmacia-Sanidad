import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { SearchInput } from '@/components/common/SearchInput'
import { StaggerList, StaggerItem } from '@/components/animations/StaggerList'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { ProductoCard } from '@/components/domain/ProductoCard'
import { useProductos } from '@/hooks/useProductos'
import { useAuthStore } from '@/store/authStore'
import type { Producto } from '@/types/domain'

export function ProductosPage() {
  const { data: productos, isLoading } = useProductos()
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  const hasRole = useAuthStore((s) => s.hasRole)
  const esAdmin = hasRole('ADMIN')

  const filtrados = useMemo(() => {
    if (!productos) return []
    if (!busqueda.trim()) return productos
    const q = busqueda.toLowerCase()
    return productos.filter(
      (p) =>
        p.nombreComercial.toLowerCase().includes(q) ||
        p.nombreGenerico?.toLowerCase().includes(q) ||
        p.codigoInterno.toLowerCase().includes(q)
    )
  }, [productos, busqueda])

  function irADetalle(producto: Producto) {
    navigate(`/productos/${producto.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Catálogo de medicamentos y productos generales"
        actions={
          <>
            <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar producto…" />
            {esAdmin && (
              <Button onClick={() => navigate('/productos/nuevo')}>
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                Nuevo producto
              </Button>
            )}
          </>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icon={Package}
          title={busqueda ? 'No encontramos nada' : 'Todavía no hay productos'}
          description={
            busqueda
              ? 'Probá con otro nombre o código.'
              : 'Registrá tu primer producto para empezar a vender.'
          }
          action={
            !busqueda && esAdmin && <Button onClick={() => navigate('/productos/nuevo')}>Crear producto</Button>
          }
        />
      ) : (
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtrados.map((producto) => (
            <StaggerItem key={producto.id}>
              <ProductoCard producto={producto} onClick={irADetalle} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  )
}
