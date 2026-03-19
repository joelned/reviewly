import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function ReviewerOnlyRoute({ children }: { children: ReactNode }) {
  const { isReviewer } = useAuth()

  if (!isReviewer) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
