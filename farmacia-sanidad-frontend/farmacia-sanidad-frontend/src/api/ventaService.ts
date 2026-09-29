import { axiosClient } from './axiosClient'
import type {
  VentaRequest, VentaResponse, ComprobanteResponse, AnularVentaRequest,
  Cliente, ClienteRequest,
} from '@/types/domain'

export const ventaService = {
  listar: async (): Promise<VentaResponse[]> => {
    const res = await axiosClient.get<VentaResponse[]>('/ventas')
    return res.data
  },
  obtener: async (id: string): Promise<VentaResponse> => {
    const res = await axiosClient.get<VentaResponse>(`/ventas/${id}`)
    return res.data
  },
  obtenerComprobante: async (id: string): Promise<ComprobanteResponse> => {
    const res = await axiosClient.get<ComprobanteResponse>(`/ventas/${id}/comprobante`)
    return res.data
  },
  crear: async (data: VentaRequest): Promise<VentaResponse> => {
    const res = await axiosClient.post<VentaResponse>('/ventas', data)
    return res.data
  },
  anular: async (id: string, data: AnularVentaRequest): Promise<VentaResponse> => {
    const res = await axiosClient.patch<VentaResponse>(`/ventas/${id}/anular`, data)
    return res.data
  },
}

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const res = await axiosClient.get<Cliente[]>('/clientes')
    return res.data
  },
  buscar: async (texto: string): Promise<Cliente[]> => {
    const res = await axiosClient.get<Cliente[]>('/clientes/buscar', { params: { texto } })
    return res.data
  },
  crear: async (data: ClienteRequest): Promise<Cliente> => {
    const res = await axiosClient.post<Cliente>('/clientes', data)
    return res.data
  },
}
