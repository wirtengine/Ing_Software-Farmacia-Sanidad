import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ventaService, clienteService } from '@/api/ventaService'
import type { VentaRequest, AnularVentaRequest, ClienteRequest } from '@/types/domain'

export function useVentas() {
  return useQuery({ queryKey: ['ventas'], queryFn: ventaService.listar })
}

export function useVenta(id: string | undefined) {
  return useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventaService.obtener(id!),
    enabled: !!id,
  })
}

export function useComprobante(id: string | undefined) {
  return useQuery({
    queryKey: ['ventas', id, 'comprobante'],
    queryFn: () => ventaService.obtenerComprobante(id!),
    enabled: !!id,
  })
}

export function useCrearVenta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: VentaRequest) => ventaService.crear(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['caja'] })
    },
  })
}

export function useAnularVenta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AnularVentaRequest }) =>
      ventaService.anular(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Venta anulada')
    },
  })
}

export function useClientes() {
  return useQuery({ queryKey: ['clientes'], queryFn: clienteService.listar })
}

export function useBuscarClientes(texto: string) {
  return useQuery({
    queryKey: ['clientes', 'buscar', texto],
    queryFn: () => clienteService.buscar(texto),
    enabled: texto.length > 0,
  })
}

export function useCrearCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ClienteRequest) => clienteService.crear(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] })
      toast.success('Cliente registrado')
    },
  })
}
