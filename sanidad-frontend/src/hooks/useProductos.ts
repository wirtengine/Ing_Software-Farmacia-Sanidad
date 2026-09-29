import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productoService } from '@/api/productoService'
import type {
  MedicamentoRequest, ProductoGeneralRequest, ProductoUnidadRequest,
} from '@/types/domain'

export function useProductos() {
  return useQuery({
    queryKey: ['productos'],
    queryFn: productoService.listar,
  })
}

export function useProducto(id: string | undefined) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productoService.obtener(id!),
    enabled: !!id,
  })
}

export function useBuscarProductos(codigo: string) {
  return useQuery({
    queryKey: ['productos', 'buscar', codigo],
    queryFn: () => productoService.buscar(codigo),
    enabled: codigo.length > 0,
    staleTime: 10_000,
  })
}

export function useCrearMedicamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MedicamentoRequest) => productoService.crearMedicamento(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Medicamento registrado')
    },
  })
}

export function useCrearProductoGeneral() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductoGeneralRequest) => productoService.crearGeneral(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Producto registrado')
    },
  })
}

export function useActualizarMedicamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicamentoRequest }) =>
      productoService.actualizarMedicamento(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('Medicamento actualizado')
    },
  })
}

export function useActualizarProductoGeneral() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductoGeneralRequest }) =>
      productoService.actualizarGeneral(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('Producto actualizado')
    },
  })
}

export function useToggleProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      activo ? productoService.desactivar(id) : productoService.activar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      toast.success('Listo, se actualizó el estado')
    },
  })
}

export function useAsignarEstante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estanteId }: { id: string; estanteId: string }) =>
      productoService.asignarEstante(id, estanteId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('Estante asignado')
    },
  })
}

export function useAgregarUnidad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductoUnidadRequest }) =>
      productoService.agregarUnidad(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('Unidad de venta agregada')
    },
  })
}

export function useEliminarUnidad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, unidadId }: { id: string; unidadId: string }) =>
      productoService.eliminarUnidad(id, unidadId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('Unidad eliminada')
    },
  })
}

export function useSubirImagen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, archivo, onProgreso }: { id: string; archivo: File; onProgreso?: (p: number) => void }) =>
      productoService.subirImagen(id, archivo, onProgreso),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['productos', vars.id] })
      toast.success('¡Imagen guardada!')
    },
  })
}

export function useEliminarImagen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productoService.eliminarImagen(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['productos'] })
      qc.invalidateQueries({ queryKey: ['productos', id] })
      toast.success('Imagen eliminada')
    },
  })
}
