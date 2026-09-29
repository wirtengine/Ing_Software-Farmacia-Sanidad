import { axiosClient } from './axiosClient'
import type { Lote, RegistrarLoteRequest } from '@/types/domain'

export const loteService = {
  listar: async (): Promise<Lote[]> => {
    const res = await axiosClient.get<Lote[]>('/lotes')
    return res.data
  },
  listarPorProducto: async (productoId: string): Promise<Lote[]> => {
    const res = await axiosClient.get<Lote[]>(`/lotes/producto/${productoId}`)
    return res.data
  },
  obtener: async (id: string): Promise<Lote> => {
    const res = await axiosClient.get<Lote>(`/lotes/${id}`)
    return res.data
  },
  proximosAVencer: async (dias = 30): Promise<Lote[]> => {
    const res = await axiosClient.get<Lote[]>('/lotes/proximos-a-vencer', { params: { dias } })
    return res.data
  },
  registrarEntrada: async (data: RegistrarLoteRequest): Promise<Lote> => {
    const res = await axiosClient.post<Lote>('/lotes', data)
    return res.data
  },
}
