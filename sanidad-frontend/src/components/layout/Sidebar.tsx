import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, ShoppingCart, Receipt, Wallet, Package, Boxes, Layers, ArrowLeftRight,
  Stethoscope, RotateCcw, Bell, TrendingUp, Truck, Users, FileBarChart, QrCode,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/authStore'

interface Item { to: string; label: string; icon: LucideIcon; roles: string[]; tono: string }
interface Grupo { titulo: string; items: Item[] }

const T = ['ADMIN', 'REGENTE', 'VENDEDOR']
const AR = ['ADMIN', 'REGENTE']

const grupos: Grupo[] = [
  { titulo: 'Mostrador', items: [
    { to: '/', label: 'Panel', icon: LayoutDashboard, roles: AR, tono: 'bg-mint-100 text-sage-600' },
    { to: '/pos', label: 'Punto de venta', icon: ShoppingCart, roles: T, tono: 'bg-blush-100 text-blush-500' },
    { to: '/ventas', label: 'Ventas', icon: Receipt, roles: T, tono: 'bg-sky-100 text-sky-500' },
    { to: '/caja', label: 'Caja', icon: Wallet, roles: T, tono: 'bg-butter-100 text-[#9A6B12]' },
    { to: '/dispensacion', label: 'Dispensación', icon: Stethoscope, roles: ['REGENTE'], tono: 'bg-lavender-100 text-lavender-500' },
  ]},
  { titulo: 'Inventario', items: [
    { to: '/productos', label: 'Productos', icon: Package, roles: T, tono: 'bg-mint-100 text-sage-600' },
    { to: '/estantes', label: 'Estantes 3D', icon: Boxes, roles: T, tono: 'bg-lavender-100 text-lavender-500' },
    { to: '/lotes', label: 'Lotes', icon: Layers, roles: AR, tono: 'bg-sky-100 text-sky-500' },
    { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, roles: AR, tono: 'bg-butter-100 text-[#9A6B12]' },
    { to: '/devoluciones', label: 'Devoluciones', icon: RotateCcw, roles: T, tono: 'bg-blush-100 text-blush-500' },
    { to: '/qr', label: 'Códigos QR', icon: QrCode, roles: T, tono: 'bg-mint-100 text-sage-600' },
  ]},
  { titulo: 'Gestión', items: [
    { to: '/alertas', label: 'Alertas', icon: Bell, roles: AR, tono: 'bg-blush-100 text-blush-500' },
    { to: '/recomendaciones', label: 'Recomendaciones', icon: TrendingUp, roles: AR, tono: 'bg-lavender-100 text-lavender-500' },
    { to: '/proveedores', label: 'Proveedores', icon: Truck, roles: AR, tono: 'bg-sky-100 text-sky-500' },
    { to: '/reportes', label: 'Reportes', icon: FileBarChart, roles: AR, tono: 'bg-butter-100 text-[#9A6B12]' },
    { to: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'], tono: 'bg-mint-100 text-sage-600' },
  ]},
]

export function Sidebar({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const usuario = useAuthStore((s) => s.usuario)
  return (
    <aside className={cn('flex h-full flex-col border-r border-white/60 bg-white/70 backdrop-blur-xl transition-all duration-300', collapsed ? 'w-[76px]' : 'w-64')}>
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sage-300 to-sage-600 text-white shadow-soft">
          <span className="text-xl font-bold leading-none">+</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-serif text-base leading-tight text-sage-700">Farmacia Sanidad</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-subtle">Nicaragua</p>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        {grupos.map((g) => {
          const visibles = g.items.filter((i) => usuario && i.roles.includes(usuario.rol))
          if (visibles.length === 0) return null
          return (
            <div key={g.titulo}>
              {!collapsed && <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">{g.titulo}</p>}
              <div className="space-y-0.5">
                {visibles.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onNavigate} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400">
                    {({ isActive }) => (
                      <div className={cn('relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive ? 'text-ink' : 'text-ink-muted hover:bg-white/80 hover:text-ink')}>
                        {isActive && (
                          <motion.div layoutId="sidebar-bg" className="absolute inset-0 -z-10 rounded-xl bg-white shadow-soft"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                        )}
                        {isActive && (
                          <motion.div layoutId="sidebar-indicator" className="absolute -left-3 top-2 bottom-2 w-1 rounded-full bg-sage-500"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                        )}
                        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', item.tono)}>
                          <item.icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
