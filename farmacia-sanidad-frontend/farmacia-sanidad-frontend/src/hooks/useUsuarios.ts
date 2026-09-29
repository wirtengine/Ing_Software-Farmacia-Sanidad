import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usuarioService } from '@/api/usuarioService'
import type { RegisterRequest } from '@/types/domain'

export function useUsuarios() {
  return useQuery({ queryKey: ['usuarios'], queryFn: usuarioService.listar })
}

export function useRegistrarUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterRequest) => usuarioService.registrar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario registrado')
    },
  })
}

export function useToggleUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      activo ? usuarioService.desactivar(id) : usuarioService.activar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Listo, se actualizó el estado')
    },
  })
}
