import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proveedorService } from '@/api/proveedorService'
import type { ProveedorRequest } from '@/types/domain'

export function useProveedores() {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: proveedorService.listar,
  })
}

export function useProveedor(id: string | undefined) {
  return useQuery({
    queryKey: ['proveedores', id],
    queryFn: () => proveedorService.obtener(id!),
    enabled: !!id,
  })
}

export function useCrearProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProveedorRequest) => proveedorService.crear(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] })
      toast.success('Proveedor registrado')
    },
  })
}

export function useActualizarProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProveedorRequest }) =>
      proveedorService.actualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] })
      toast.success('Proveedor actualizado')
    },
  })
}

export function useToggleProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      activo ? proveedorService.desactivar(id) : proveedorService.activar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proveedores'] })
      toast.success('Listo, se actualizó el estado')
    },
  })
}
