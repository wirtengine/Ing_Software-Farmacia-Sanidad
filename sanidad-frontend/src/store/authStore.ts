import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto } from '@/types/domain'

interface AuthState {
  token: string | null
  usuario: UserDto | null
  isAuthenticated: boolean
  login: (token: string, usuario: UserDto) => void
  logout: () => void
  hasRole: (...roles: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
      hasRole: (...roles) => {
        const usuario = get().usuario
        if (!usuario) return false
        return roles.includes(usuario.rol)
      },
    }),
    {
      name: 'farmacia-auth-storage',
    }
  )
)
