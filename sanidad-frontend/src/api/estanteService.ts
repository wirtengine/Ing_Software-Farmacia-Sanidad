import { axiosClient } from './axiosClient'
import type { Estante, EstanteRequest } from '@/types/domain'

export const estanteService = {
  listar: async (): Promise<Estante[]> => {
    const res = await axiosClient.get<Estante[]>('/estantes')
    return res.data
  },
  listarActivos: async (): Promise<Estante[]> => {
    const res = await axiosClient.get<Estante[]>('/estantes/activos')
    return res.data
  },
  obtener: async (id: string): Promise<Estante> => {
    const res = await axiosClient.get<Estante>(`/estantes/${id}`)
    return res.data
  },
  crear: async (data: EstanteRequest): Promise<Estante> => {
    const res = await axiosClient.post<Estante>('/estantes', data)
    return res.data
  },
  actualizar: async (id: string, data: EstanteRequest): Promise<Estante> => {
    const res = await axiosClient.put<Estante>(`/estantes/${id}`, data)
    return res.data
  },
  desactivar: async (id: string): Promise<Estante> => {
    const res = await axiosClient.patch<Estante>(`/estantes/${id}/desactivar`)
    return res.data
  },
  activar: async (id: string): Promise<Estante> => {
    const res = await axiosClient.patch<Estante>(`/estantes/${id}/activar`)
    return res.data
  },
}
