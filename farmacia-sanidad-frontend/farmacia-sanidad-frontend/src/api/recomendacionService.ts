import { axiosClient } from './axiosClient'
import type { Recomendacion, GestionarRecomendacionRequest, TipoRecomendacion } from '@/types/domain'

export const recomendacionService = {
  listarActivas: async (): Promise<Recomendacion[]> => {
    const res = await axiosClient.get<Recomendacion[]>('/recomendaciones')
    return res.data
  },
  listarPorTipo: async (tipo: TipoRecomendacion): Promise<Recomendacion[]> => {
    const res = await axiosClient.get<Recomendacion[]>(`/recomendaciones/tipo/${tipo}`)
    return res.data
  },
  gestionar: async (id: string, data: GestionarRecomendacionRequest): Promise<Recomendacion> => {
    const res = await axiosClient.patch<Recomendacion>(`/recomendaciones/${id}/gestionar`, data)
    return res.data
  },
  generarManualmente: async (): Promise<{ recomendacionesGeneradas: number }> => {
    const res = await axiosClient.post('/recomendaciones/generar')
    return res.data
  },
}
