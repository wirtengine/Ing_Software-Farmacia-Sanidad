import { axiosClient } from './axiosClient'
import type {
  Producto, ProductoUnidad, ProductoUnidadRequest,
  MedicamentoRequest, ProductoGeneralRequest, ProductoBusqueda,
} from '@/types/domain'

export const productoService = {
  listar: async (): Promise<Producto[]> => {
    const res = await axiosClient.get<Producto[]>('/productos')
    return res.data
  },
  listarActivos: async (): Promise<Producto[]> => {
    const res = await axiosClient.get<Producto[]>('/productos/activos')
    return res.data
  },
  obtener: async (id: string): Promise<Producto> => {
    const res = await axiosClient.get<Producto>(`/productos/${id}`)
    return res.data
  },
  buscar: async (codigo: string): Promise<ProductoBusqueda[]> => {
    const res = await axiosClient.get<ProductoBusqueda[]>('/productos/buscar', {
      params: { codigo },
    })
    return res.data
  },
  crearMedicamento: async (data: MedicamentoRequest): Promise<Producto> => {
    const res = await axiosClient.post<Producto>('/productos/medicamentos', data)
    return res.data
  },
  crearGeneral: async (data: ProductoGeneralRequest): Promise<Producto> => {
    const res = await axiosClient.post<Producto>('/productos/generales', data)
    return res.data
  },
  actualizarMedicamento: async (id: string, data: MedicamentoRequest): Promise<Producto> => {
    const res = await axiosClient.put<Producto>(`/productos/medicamentos/${id}`, data)
    return res.data
  },
  actualizarGeneral: async (id: string, data: ProductoGeneralRequest): Promise<Producto> => {
    const res = await axiosClient.put<Producto>(`/productos/generales/${id}`, data)
    return res.data
  },
  desactivar: async (id: string): Promise<Producto> => {
    const res = await axiosClient.patch<Producto>(`/productos/${id}/desactivar`)
    return res.data
  },
  activar: async (id: string): Promise<Producto> => {
    const res = await axiosClient.patch<Producto>(`/productos/${id}/activar`)
    return res.data
  },
  asignarEstante: async (id: string, estanteId: string): Promise<Producto> => {
    const res = await axiosClient.patch<Producto>(`/productos/${id}/estante`, { estanteId })
    return res.data
  },
  quitarEstante: async (id: string): Promise<Producto> => {
    const res = await axiosClient.delete<Producto>(`/productos/${id}/estante`)
    return res.data
  },
  listarUnidades: async (id: string): Promise<ProductoUnidad[]> => {
    const res = await axiosClient.get<ProductoUnidad[]>(`/productos/${id}/unidades`)
    return res.data
  },
  agregarUnidad: async (id: string, data: ProductoUnidadRequest): Promise<ProductoUnidad> => {
    const res = await axiosClient.post<ProductoUnidad>(`/productos/${id}/unidades`, data)
    return res.data
  },
  actualizarUnidad: async (
    id: string,
    unidadId: string,
    data: ProductoUnidadRequest
  ): Promise<ProductoUnidad> => {
    const res = await axiosClient.put<ProductoUnidad>(`/productos/${id}/unidades/${unidadId}`, data)
    return res.data
  },
  eliminarUnidad: async (id: string, unidadId: string): Promise<void> => {
    await axiosClient.delete(`/productos/${id}/unidades/${unidadId}`)
  },
  subirImagen: async (
    productoId: string,
    archivo: File,
    onProgreso?: (porcentaje: number) => void
  ): Promise<Producto> => {
    const formData = new FormData()
    formData.append('archivo', archivo)
    const res = await axiosClient.post<Producto>(`/productos/${productoId}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgreso && e.total) onProgreso(Math.round((e.loaded * 100) / e.total))
      },
    })
    return res.data
  },
  eliminarImagen: async (productoId: string): Promise<Producto> => {
    const res = await axiosClient.delete<Producto>(`/productos/${productoId}/imagen`)
    return res.data
  },
}
