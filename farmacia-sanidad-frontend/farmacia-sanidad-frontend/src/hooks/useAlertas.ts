import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { alertaService } from '@/api/alertaService'
import type { TipoAlerta } from '@/types/domain'

export function useAlertas() {
  return useQuery({ queryKey: ['alertas'], queryFn: alertaService.listarActivas })
}

export function useAlertasPorTipo(tipo: TipoAlerta) {
  return useQuery({
    queryKey: ['alertas', 'tipo', tipo],
    queryFn: () => alertaService.listarPorTipo(tipo),
  })
}

export function useResolverAlerta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => alertaService.resolver(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alertas'] })
      toast.success('Alerta resuelta')
    },
  })
}

export function useGenerarAlertas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => alertaService.generarManualmente(),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['alertas'] })
      toast.success(`Se generaron ${data.alertasGeneradas} alertas`)
    },
  })
}
