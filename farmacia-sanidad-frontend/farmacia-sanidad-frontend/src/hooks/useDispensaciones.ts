import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { dispensacionService } from '@/api/dispensacionService'
import type { DispensacionRequest } from '@/types/domain'

export function useDispensaciones() {
  return useQuery({ queryKey: ['dispensaciones'], queryFn: dispensacionService.listar })
}

export function useRegistrarDispensacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DispensacionRequest) => dispensacionService.registrar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dispensaciones'] })
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Dispensación registrada')
    },
  })
}
