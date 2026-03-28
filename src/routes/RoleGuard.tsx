import { type ReactNode, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { type UserRole } from '@/types'

export function RoleGuard({ allowedRoles, children }: { allowedRoles: UserRole[]; children?: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const allowed = user ? allowedRoles.includes(user.role) : false

  useEffect(() => {
    if (!allowed) {
      toast.info("You don't have permission to access that page.")
    }
  }, [allowed])

  if (!allowed) {
    return <Navigate to="/dashboard" replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
