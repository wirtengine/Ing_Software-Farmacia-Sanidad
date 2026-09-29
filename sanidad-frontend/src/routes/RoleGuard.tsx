import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface RoleGuardProps {
  roles: string[]
}

export function RoleGuard({ roles }: RoleGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole)
  if (!hasRole(...roles)) {
    return <Navigate to="/403" replace />
  }
  return <Outlet />
}
