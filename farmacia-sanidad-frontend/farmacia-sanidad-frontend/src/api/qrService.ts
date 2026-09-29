import { axiosClient } from './axiosClient'
import type { QrProductoInfo } from '@/types/domain'

export const qrService = {
  listarPorProducto: async (productoId: string): Promise<QrProductoInfo[]> => {
    const res = await axiosClient.get<QrProductoInfo[]>(`/qr/producto/${productoId}`)
    return res.data
  },
  urlQrUnidad: (productoId: string, unidadId: string): string => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
    return `${base}/qr/producto/${productoId}/unidad/${unidadId}`
  },
}
