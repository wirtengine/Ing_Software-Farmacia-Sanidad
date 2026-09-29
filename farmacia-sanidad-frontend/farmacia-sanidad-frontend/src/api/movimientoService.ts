import { axiosClient } from './axiosClient'
import type { MovimientoResponse, AjusteInventarioRequest } from '@/types/domain'

export const movimientoService = {
  listar: async (): Promise<MovimientoResponse[]> => {
    const res = await axiosClient.get<MovimientoResponse[]>('/movimientos')
    return res.data
  },
  listarPorProducto: async (productoId: string): Promise<MovimientoResponse[]> => {
    const res = await axiosClient.get<MovimientoResponse[]>(`/movimientos/producto/${productoId}`)
    return res.data
  },
  registrarAjuste: async (data: AjusteInventarioRequest): Promise<{ resultado: number }> => {
    const res = await axiosClient.post('/movimientos/ajuste', data)
    return res.data
  },
}
