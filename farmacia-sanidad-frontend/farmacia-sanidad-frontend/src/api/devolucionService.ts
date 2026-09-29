import { axiosClient } from './axiosClient'
import type {
  Devolucion, DevolucionClienteRequest, DevolucionProveedorRequest,
  DisponerDevolucionRequest, TipoDevolucion,
} from '@/types/domain'

export const devolucionService = {
  listar: async (): Promise<Devolucion[]> => {
    const res = await axiosClient.get<Devolucion[]>('/devoluciones')
    return res.data
  },
  listarPorTipo: async (tipo: TipoDevolucion): Promise<Devolucion[]> => {
    const res = await axiosClient.get<Devolucion[]>(`/devoluciones/tipo/${tipo}`)
    return res.data
  },
  obtener: async (id: string): Promise<Devolucion> => {
    const res = await axiosClient.get<Devolucion>(`/devoluciones/${id}`)
    return res.data
  },
  registrarCliente: async (data: DevolucionClienteRequest): Promise<Devolucion> => {
    const res = await axiosClient.post<Devolucion>('/devoluciones/cliente', data)
    return res.data
  },
  registrarProveedor: async (data: DevolucionProveedorRequest): Promise<Devolucion> => {
    const res = await axiosClient.post<Devolucion>('/devoluciones/proveedor', data)
    return res.data
  },
  disponer: async (id: string, data: DisponerDevolucionRequest): Promise<Devolucion> => {
    const res = await axiosClient.patch<Devolucion>(`/devoluciones/${id}/disponer`, data)
    return res.data
  },
}
