import { axiosClient } from './axiosClient'
import type { AuthResponse, LoginRequest, UserDto } from '@/types/domain'

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosClient.post<AuthResponse>('/auth/login', data)
    return res.data
  },
  perfil: async (): Promise<UserDto> => {
    const res = await axiosClient.get<UserDto>('/usuarios/perfil')
    return res.data
  },
}
