import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileBarChart } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { reporteService } from '@/api/reporteService'
import { toast } from 'sonner'

export function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10))
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10))
  const [descargando, setDescargando] = useState<string | null>(null)

  async function descargar(tipo: string, fn: () => Promise<void>) {
    setDescargando(tipo)
    try {
      await fn()
      toast.success('Reporte descargado')
    } catch {
      toast.error('No se pudo descargar el reporte')
    } finally {
      setDescargando(null)
    }
  }

  const reportes = [
    {
      id: 'stock',
      titulo: 'Reporte de stock',
      descripcion: 'Stock actual de todos los productos activos',
      accion: () => reporteService.descargarStockCsv(),
    },
    {
      id: 'movimientos',
      titulo: 'Movimientos de inventario',
      descripcion: 'Historial completo de entradas y salidas',
      accion: () => reporteService.descargarMovimientosCsv(),
    },
    {
      id: 'alertas',
      titulo: 'Alertas activas',
      descripcion: 'Stock crítico y vencimientos próximos',
      accion: () => reporteService.descargarAlertasCsv(),
    },
    {
      id: 'recomendaciones',
      titulo: 'Recomendaciones activas',
      descripcion: 'Sugerencias de compra, liquidación y descontinuación',
      accion: () => reporteService.descargarRecomendacionesCsv(),
    },
  ]

  return (
    <div>
      <PageHeader title="Reportes" description="Exportá información en formato CSV" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4 text-sage-600" strokeWidth={1.75} />
            Reporte de ventas por rango
          </CardTitle>
          <CardDescription>Elegí un período para exportar las ventas realizadas</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="fechaInicio">Desde</Label>
            <Input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fechaFin">Hasta</Label>
            <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          <Button
            onClick={() => descargar('ventas', () => reporteService.descargarVentasCsv(fechaInicio, fechaFin))}
            loading={descargando === 'ventas'}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Descargar CSV
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportes.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{r.titulo}</CardTitle>
                <CardDescription>{r.descripcion}</CardDescription>
              </CardHeader>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => descargar(r.id, r.accion)}
                loading={descargando === r.id}
              >
                <Download className="h-4 w-4" strokeWidth={1.75} />
                Descargar CSV
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
