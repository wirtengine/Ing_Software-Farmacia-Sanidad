import { Sheet } from '@/components/ui/Sheet'
import { Sidebar } from './Sidebar'
import { useSidebarStore } from '@/store/sidebarStore'

export function MobileNav() {
  const mobileOpen = useSidebarStore((s) => s.mobileOpen)
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen)

  return (
    <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)} className="p-0 w-72">
      <Sidebar onNavigate={() => setMobileOpen(false)} />
    </Sheet>
  )
}
