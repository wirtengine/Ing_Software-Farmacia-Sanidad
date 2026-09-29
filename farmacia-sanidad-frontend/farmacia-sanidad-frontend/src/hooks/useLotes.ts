import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loteService } from '@/api/loteService'
import type { RegistrarLoteRequest } from '@/types/domain'

export function useLotes() {
  return useQuery({ queryKey: ['lotes'], queryFn: loteService.listar })
}

export function useLotesPorProducto(productoId: string | undefined) {
  return useQuery({
    queryKey: ['lotes', 'producto', productoId],
    queryFn: () => loteService.listarPorProducto(productoId!),
    enabled: !!productoId,
  })
}

export function useLotesProximosAVencer(dias = 30) {
  return useQuery({
    queryKey: ['lotes', 'proximos-a-vencer', dias],
    queryFn: () => loteService.proximosAVencer(dias),
  })
}

export function useRegistrarLote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegistrarLoteRequest) => loteService.registrarEntrada(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lotes'] })
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Lote registrado sin problemas')
    },
  })
}
