import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cajaService } from '@/api/cajaService'
import type { AbrirCajaRequest, CerrarCajaRequest } from '@/types/domain'

export function useCajas() {
  return useQuery({ queryKey: ['caja'], queryFn: cajaService.listar })
}

export function useCajaActual() {
  return useQuery({
    queryKey: ['caja', 'actual'],
    queryFn: cajaService.obtenerActual,
    retry: false,
  })
}

export function useAbrirCaja() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AbrirCajaRequest) => cajaService.abrir(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caja'] })
      toast.success('Caja abierta. ¡Buenas ventas!')
    },
  })
}

export function useCerrarCaja() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CerrarCajaRequest }) =>
      cajaService.cerrar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caja'] })
      toast.success('Caja cerrada correctamente')
    },
  })
}
