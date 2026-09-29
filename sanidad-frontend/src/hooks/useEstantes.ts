import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { estanteService } from '@/api/estanteService'
import type { EstanteRequest } from '@/types/domain'

export function useEstantes() {
  return useQuery({
    queryKey: ['estantes'],
    queryFn: estanteService.listar,
  })
}

export function useEstante(id: string | undefined) {
  return useQuery({
    queryKey: ['estantes', id],
    queryFn: () => estanteService.obtener(id!),
    enabled: !!id,
  })
}

export function useCrearEstante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EstanteRequest) => estanteService.crear(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['estantes'] })
      toast.success('Estante creado sin problemas')
    },
  })
}

export function useActualizarEstante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EstanteRequest }) =>
      estanteService.actualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['estantes'] })
      toast.success('Estante actualizado')
    },
  })
}

export function useToggleEstante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      activo ? estanteService.desactivar(id) : estanteService.activar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['estantes'] })
      toast.success('Listo, se actualizó el estado')
    },
  })
}
