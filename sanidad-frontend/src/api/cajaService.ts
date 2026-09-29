import { axiosClient } from './axiosClient'
import type { Caja, AbrirCajaRequest, CerrarCajaRequest } from '@/types/domain'

export const cajaService = {
  listar: async (): Promise<Caja[]> => {
    const res = await axiosClient.get<Caja[]>('/caja')
    return res.data
  },
  obtenerActual: async (): Promise<Caja> => {
    const res = await axiosClient.get<Caja>('/caja/actual')
    return res.data
  },
  abrir: async (data: AbrirCajaRequest): Promise<Caja> => {
    const res = await axiosClient.post<Caja>('/caja/abrir', data)
    return res.data
  },
  cerrar: async (id: string, data: CerrarCajaRequest): Promise<Caja> => {
    const res = await axiosClient.patch<Caja>(`/caja/${id}/cerrar`, data)
    return res.data
  },
}
