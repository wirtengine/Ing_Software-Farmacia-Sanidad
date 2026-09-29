import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/api/dashboardService'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.obtener,
    refetchInterval: 60_000,
  })
}
