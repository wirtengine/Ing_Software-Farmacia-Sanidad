import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { movimientoService } from '@/api/movimientoService'
import type { AjusteInventarioRequest } from '@/types/domain'

export function useMovimientos() {
  return useQuery({ queryKey: ['movimientos'], queryFn: movimientoService.listar })
}

export function useMovimientosPorProducto(productoId: string | undefined) {
  return useQuery({
    queryKey: ['movimientos', 'producto', productoId],
    queryFn: () => movimientoService.listarPorProducto(productoId!),
    enabled: !!productoId,
  })
}

export function useRegistrarAjuste() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AjusteInventarioRequest) => movimientoService.registrarAjuste(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movimientos'] })
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Ajuste registrado')
    },
  })
}
