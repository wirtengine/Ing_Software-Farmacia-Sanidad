import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { useSidebarStore } from '@/store/sidebarStore'

export function AppShell() {
  const collapsed = useSidebarStore((s) => s.collapsed)

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>
      <MobileNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
