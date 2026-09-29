import { axiosClient } from './axiosClient'
import type { UserDto, RegisterRequest } from '@/types/domain'

export const usuarioService = {
  listar: async (): Promise<UserDto[]> => {
    const res = await axiosClient.get<UserDto[]>('/usuarios')
    return res.data
  },
  listarActivos: async (): Promise<UserDto[]> => {
    const res = await axiosClient.get<UserDto[]>('/usuarios/activos')
    return res.data
  },
  registrar: async (data: RegisterRequest): Promise<UserDto> => {
    const res = await axiosClient.post<UserDto>('/auth/register', data)
    return res.data
  },
  desactivar: async (id: string): Promise<UserDto> => {
    const res = await axiosClient.patch<UserDto>(`/usuarios/${id}/desactivar`)
    return res.data
  },
  activar: async (id: string): Promise<UserDto> => {
    const res = await axiosClient.patch<UserDto>(`/usuarios/${id}/activar`)
    return res.data
  },
}
