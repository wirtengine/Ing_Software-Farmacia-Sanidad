import { axiosClient } from './axiosClient'
import type { DashboardResponse } from '@/types/domain'

export const dashboardService = {
  obtener: async (): Promise<DashboardResponse> => {
    const res = await axiosClient.get<DashboardResponse>('/dashboard')
    return res.data
  },
}
