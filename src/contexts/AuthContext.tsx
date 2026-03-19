import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthUser, UserRole } from '../types'

const MOCK_USERS: Record<UserRole, AuthUser> = {
  SUBMITTER: {
    id: 'user-001',
    username: 'embiidcodes',
    displayName: 'Embiid O.',
    avatarUrl: '',
    role: 'SUBMITTER',
    reputation: 0,
    orgSlug: 'acme-dev',
    plan: 'PRO',
  },
  REVIEWER: {
    id: 'user-002',
    username: 'sconnor_dev',
    displayName: 'Sarah Connor',
    avatarUrl: '',
    role: 'REVIEWER',
    reputation: 1248,
    orgSlug: 'acme-dev',
    plan: 'PRO',
  },
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
  isSubmitter: boolean
  isReviewer: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'reviewly_mock_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch {
      return null
    }
  })

  const login = (role: UserRole) => {
    const mockUser = MOCK_USERS[role]
    setUser(mockUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
        isSubmitter: user?.role === 'SUBMITTER',
        isReviewer: user?.role === 'REVIEWER',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
