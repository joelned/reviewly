import { create } from 'zustand'
import { type User } from '@/types'

const STORAGE_KEY = 'reviewly-auth'

interface AuthStoreState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  hydrate: () => void
}

function persistAuth(token: string | null, user: User | null) {
  if (!token || !user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token,
      user,
    })
  )
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => {
    persistAuth(token, user)
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    persistAuth(null, null)
    set({ token: null, user: null, isAuthenticated: false })
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  },
  hydrate: () => {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      set({ user: null, token: null, isAuthenticated: false })
      return
    }

    try {
      const parsed = JSON.parse(raw) as { token: string; user: User }
      set({
        user: parsed.user,
        token: parsed.token,
        isAuthenticated: Boolean(parsed.token && parsed.user),
      })
    } catch {
      persistAuth(null, null)
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))

export const authStore = useAuthStore

