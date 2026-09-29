import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'
import { ROL_LABELS } from '@/lib/format'

function saludo() {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
}

export function Topbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const { setMobileOpen, toggleCollapsed, collapsed } = useSidebarStore()
  const navigate = useNavigate()
  const iniciales = usuario?.nombreCompleto.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  const fecha = new Intl.DateTimeFormat('es-NI', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-white/60 bg-white/60 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-2">
        <button className="-ml-2 rounded-lg p-2 text-ink-muted hover:bg-white md:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button className="hidden rounded-lg p-2 text-ink-muted hover:bg-white md:block" onClick={toggleCollapsed} aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}>
          {collapsed ? <PanelLeftOpen className="h-5 w-5" strokeWidth={1.75} /> : <PanelLeftClose className="h-5 w-5" strokeWidth={1.75} />}
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-ink">{saludo()}, {usuario?.nombreCompleto.split(' ')[0]} 🌿</p>
          <p className="text-xs capitalize text-ink-subtle">{fecha}</p>
        </div>
      </div>

      <DropdownMenu
        trigger={
          <button className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-white" aria-label="Menú de usuario">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lavender-200 to-mint-200 text-sm font-semibold text-sage-700">
              {iniciales}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-ink">{usuario?.nombreCompleto}</p>
              <p className="text-xs leading-tight text-ink-subtle">{usuario ? ROL_LABELS[usuario.rol] : ''}</p>
            </div>
          </button>
        }
      >
        <DropdownMenuItem onClick={() => { logout(); navigate('/login') }} className="text-danger">
          <LogOut className="h-4 w-4" strokeWidth={1.75} /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenu>
    </header>
  )
}
