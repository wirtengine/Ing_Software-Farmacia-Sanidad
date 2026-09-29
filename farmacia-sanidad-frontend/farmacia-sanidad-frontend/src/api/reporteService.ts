import { axiosClient } from './axiosClient'
import type { ReporteStockDto, ReporteVentaDto } from '@/types/domain'

function descargarBlob(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const reporteService = {
  stock: async (): Promise<ReporteStockDto[]> => {
    const res = await axiosClient.get<ReporteStockDto[]>('/reportes/stock')
    return res.data
  },
  ventas: async (fechaInicio: string, fechaFin: string): Promise<ReporteVentaDto[]> => {
    const res = await axiosClient.get<ReporteVentaDto[]>('/reportes/ventas', {
      params: { fechaInicio, fechaFin },
    })
    return res.data
  },
  descargarStockCsv: async () => {
    const res = await axiosClient.get('/reportes/stock/csv', { responseType: 'text' })
    descargarBlob(res.data, 'reporte_stock.csv')
  },
  descargarVentasCsv: async (fechaInicio: string, fechaFin: string) => {
    const res = await axiosClient.get('/reportes/ventas/csv', {
      params: { fechaInicio, fechaFin },
      responseType: 'text',
    })
    descargarBlob(res.data, 'reporte_ventas.csv')
  },
  descargarMovimientosCsv: async () => {
    const res = await axiosClient.get('/reportes/movimientos/csv', { responseType: 'text' })
    descargarBlob(res.data, 'reporte_movimientos.csv')
  },
  descargarAlertasCsv: async () => {
    const res = await axiosClient.get('/reportes/alertas/csv', { responseType: 'text' })
    descargarBlob(res.data, 'reporte_alertas.csv')
  },
  descargarRecomendacionesCsv: async () => {
    const res = await axiosClient.get('/reportes/recomendaciones/csv', { responseType: 'text' })
    descargarBlob(res.data, 'reporte_recomendaciones.csv')
  },
}
