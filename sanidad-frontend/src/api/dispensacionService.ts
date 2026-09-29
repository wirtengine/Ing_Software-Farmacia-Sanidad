import { axiosClient } from './axiosClient'
import type { DispensacionRequest, DispensacionResponse } from '@/types/domain'

export const dispensacionService = {
  listar: async (): Promise<DispensacionResponse[]> => {
    const res = await axiosClient.get<DispensacionResponse[]>('/dispensaciones')
    return res.data
  },
  obtener: async (id: string): Promise<DispensacionResponse> => {
    const res = await axiosClient.get<DispensacionResponse>(`/dispensaciones/${id}`)
    return res.data
  },
  registrar: async (data: DispensacionRequest): Promise<DispensacionResponse> => {
    const res = await axiosClient.post<DispensacionResponse>('/dispensaciones', data)
    return res.data
  },
}
