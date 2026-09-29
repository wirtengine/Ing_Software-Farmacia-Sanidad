import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      toast.error('No tenés permisos para hacer esto')
    } else if (error.response?.data?.mensaje) {
      toast.error(error.response.data.mensaje)
    } else if (error.message === 'Network Error') {
      toast.error('No se pudo conectar con el servidor')
    }
    return Promise.reject(error)
  }
)
