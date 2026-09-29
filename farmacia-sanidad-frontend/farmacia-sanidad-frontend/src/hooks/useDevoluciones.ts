import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { devolucionService } from '@/api/devolucionService'
import type {
  DevolucionClienteRequest, DevolucionProveedorRequest,
  DisponerDevolucionRequest, TipoDevolucion,
} from '@/types/domain'

export function useDevoluciones() {
  return useQuery({ queryKey: ['devoluciones'], queryFn: devolucionService.listar })
}

export function useDevolucionesPorTipo(tipo: TipoDevolucion) {
  return useQuery({
    queryKey: ['devoluciones', 'tipo', tipo],
    queryFn: () => devolucionService.listarPorTipo(tipo),
  })
}

export function useDevolucion(id: string | undefined) {
  return useQuery({
    queryKey: ['devoluciones', id],
    queryFn: () => devolucionService.obtener(id!),
    enabled: !!id,
  })
}

export function useRegistrarDevolucionCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DevolucionClienteRequest) => devolucionService.registrarCliente(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devoluciones'] })
      toast.success('Devolución de cliente registrada')
    },
  })
}

export function useRegistrarDevolucionProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DevolucionProveedorRequest) => devolucionService.registrarProveedor(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devoluciones'] })
      toast.success('Devolución a proveedor registrada')
    },
  })
}

export function useDisponerDevolucion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DisponerDevolucionRequest }) =>
      devolucionService.disponer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devoluciones'] })
      toast.success('Devolución actualizada')
    },
  })
}
