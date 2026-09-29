import { axiosClient } from './axiosClient'
import type { Alerta, TipoAlerta } from '@/types/domain'

export const alertaService = {
  listarActivas: async (): Promise<Alerta[]> => {
    const res = await axiosClient.get<Alerta[]>('/alertas')
    return res.data
  },
  listarPorTipo: async (tipo: TipoAlerta): Promise<Alerta[]> => {
    const res = await axiosClient.get<Alerta[]>(`/alertas/tipo/${tipo}`)
    return res.data
  },
  resolver: async (id: string): Promise<Alerta> => {
    const res = await axiosClient.patch<Alerta>(`/alertas/${id}/resolver`)
    return res.data
  },
  generarManualmente: async (): Promise<{ alertasGeneradas: number }> => {
    const res = await axiosClient.post('/alertas/generar')
    return res.data
  },
}
