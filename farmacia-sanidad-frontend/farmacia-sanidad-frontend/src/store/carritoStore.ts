import { create } from 'zustand'
import type { ItemCarrito, Cliente } from '@/types/domain'

interface CarritoState {
  items: ItemCarrito[]
  clienteSeleccionado: Cliente | null
  agregarItem: (item: ItemCarrito) => void
  quitarItem: (productoUnidadId: string) => void
  actualizarCantidad: (productoUnidadId: string, cantidad: number) => void
  setCliente: (cliente: Cliente | null) => void
  limpiar: () => void
  total: () => number
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
  items: [],
  clienteSeleccionado: null,

  agregarItem: (item) => {
    set((state) => {
      const existente = state.items.find((i) => i.productoUnidadId === item.productoUnidadId)
      if (existente) {
        return {
          items: state.items.map((i) =>
            i.productoUnidadId === item.productoUnidadId
              ? { ...i, cantidad: i.cantidad + item.cantidad }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    })
  },

  quitarItem: (productoUnidadId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productoUnidadId !== productoUnidadId),
    }))
  },

  actualizarCantidad: (productoUnidadId, cantidad) => {
    if (cantidad <= 0) {
      get().quitarItem(productoUnidadId)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productoUnidadId === productoUnidadId ? { ...i, cantidad } : i
      ),
    }))
  },

  setCliente: (cliente) => set({ clienteSeleccionado: cliente }),

  limpiar: () => set({ items: [], clienteSeleccionado: null }),

  total: () => {
    return get().items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0)
  },
}))
