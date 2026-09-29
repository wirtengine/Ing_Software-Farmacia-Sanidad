import { axiosClient } from './axiosClient'
import type { Proveedor, ProveedorRequest } from '@/types/domain'

export const proveedorService = {
  listar: async (): Promise<Proveedor[]> => {
    const res = await axiosClient.get<Proveedor[]>('/proveedores')
    return res.data
  },
  listarActivos: async (): Promise<Proveedor[]> => {
    const res = await axiosClient.get<Proveedor[]>('/proveedores/activos')
    return res.data
  },
  obtener: async (id: string): Promise<Proveedor> => {
    const res = await axiosClient.get<Proveedor>(`/proveedores/${id}`)
    return res.data
  },
  crear: async (data: ProveedorRequest): Promise<Proveedor> => {
    const res = await axiosClient.post<Proveedor>('/proveedores', data)
    return res.data
  },
  actualizar: async (id: string, data: ProveedorRequest): Promise<Proveedor> => {
    const res = await axiosClient.put<Proveedor>(`/proveedores/${id}`, data)
    return res.data
  },
  desactivar: async (id: string): Promise<Proveedor> => {
    const res = await axiosClient.patch<Proveedor>(`/proveedores/${id}/desactivar`)
    return res.data
  },
  activar: async (id: string): Promise<Proveedor> => {
    const res = await axiosClient.patch<Proveedor>(`/proveedores/${id}/activar`)
    return res.data
  },
}
