import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { LoginPage } from '@/pages/LoginPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { EstantesPage } from '@/pages/EstantesPage'
import { ProductosPage } from '@/pages/ProductosPage'
import { ProductoDetallePage } from '@/pages/ProductoDetallePage'
import { ProductoNuevoPage } from '@/pages/ProductoNuevoPage'
import { ProveedoresPage } from '@/pages/ProveedoresPage'
import { POSPage } from '@/pages/POSPage'
import { VentasPage } from '@/pages/VentasPage'
import { VentaDetallePage } from '@/pages/VentaDetallePage'
import { CajaPage } from '@/pages/CajaPage'
import { LotesPage } from '@/pages/LotesPage'
import { LoteNuevoPage } from '@/pages/LoteNuevoPage'
import { MovimientosPage } from '@/pages/MovimientosPage'
import { DispensacionPage } from '@/pages/DispensacionPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AlertasPage } from '@/pages/AlertasPage'
import { RecomendacionesPage } from '@/pages/RecomendacionesPage'
import { DevolucionesPage } from '@/pages/DevolucionesPage'
import { DevolucionClienteForm } from '@/pages/DevolucionClienteForm'
import { DevolucionProveedorForm } from '@/pages/DevolucionProveedorForm'
import { ReportesPage } from '@/pages/ReportesPage'
import { QRPage } from '@/pages/QRPage'
import { UsuariosPage } from '@/pages/UsuariosPage'
import { PageTransition } from '@/components/animations/PageTransition'

export function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/403" element={<PageTransition><ForbiddenPage /></PageTransition>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route element={<RoleGuard roles={['ADMIN', 'REGENTE']} />}>
              <Route path="/devoluciones/nueva-cliente" element={<PageTransition><DevolucionClienteForm /></PageTransition>} />
              <Route path="/devoluciones/nueva-proveedor" element={<PageTransition><DevolucionProveedorForm /></PageTransition>} />
              <Route path="/" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/lotes" element={<PageTransition><LotesPage /></PageTransition>} />
              <Route path="/movimientos" element={<PageTransition><MovimientosPage /></PageTransition>} />
              <Route path="/alertas" element={<PageTransition><AlertasPage /></PageTransition>} />
              <Route path="/recomendaciones" element={<PageTransition><RecomendacionesPage /></PageTransition>} />
              <Route path="/proveedores" element={<PageTransition><ProveedoresPage /></PageTransition>} />
              <Route path="/reportes" element={<PageTransition><ReportesPage /></PageTransition>} />
            </Route>

            <Route element={<RoleGuard roles={['REGENTE']} />}>
              <Route path="/dispensacion" element={<PageTransition><DispensacionPage /></PageTransition>} />
            </Route>

            <Route element={<RoleGuard roles={['ADMIN']} />}>
              <Route path="/lotes/nuevo" element={<PageTransition><LoteNuevoPage /></PageTransition>} />
              <Route path="/usuarios" element={<PageTransition><UsuariosPage /></PageTransition>} />
              <Route path="/productos/nuevo" element={<PageTransition><ProductoNuevoPage /></PageTransition>} />
            </Route>

            <Route element={<RoleGuard roles={['ADMIN', 'REGENTE', 'VENDEDOR']} />}>
              <Route path="/pos" element={<PageTransition><POSPage /></PageTransition>} />
              <Route path="/ventas" element={<PageTransition><VentasPage /></PageTransition>} />
              <Route path="/ventas/:id" element={<PageTransition><VentaDetallePage /></PageTransition>} />
              <Route path="/caja" element={<PageTransition><CajaPage /></PageTransition>} />
              <Route path="/productos" element={<PageTransition><ProductosPage /></PageTransition>} />
              <Route path="/productos/:id" element={<PageTransition><ProductoDetallePage /></PageTransition>} />
              <Route path="/estantes" element={<PageTransition><EstantesPage /></PageTransition>} />
              <Route path="/devoluciones" element={<PageTransition><DevolucionesPage /></PageTransition>} />
              <Route path="/qr" element={<PageTransition><QRPage /></PageTransition>} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}
