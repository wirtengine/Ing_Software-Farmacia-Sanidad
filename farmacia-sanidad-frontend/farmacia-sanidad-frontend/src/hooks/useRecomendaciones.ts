import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { recomendacionService } from '@/api/recomendacionService'
import type { GestionarRecomendacionRequest, TipoRecomendacion } from '@/types/domain'

export function useRecomendaciones() {
  return useQuery({ queryKey: ['recomendaciones'], queryFn: recomendacionService.listarActivas })
}

export function useRecomendacionesPorTipo(tipo: TipoRecomendacion) {
  return useQuery({
    queryKey: ['recomendaciones', 'tipo', tipo],
    queryFn: () => recomendacionService.listarPorTipo(tipo),
  })
}

export function useGestionarRecomendacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GestionarRecomendacionRequest }) =>
      recomendacionService.gestionar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recomendaciones'] })
      toast.success('Recomendación actualizada')
    },
  })
}
