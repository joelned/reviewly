import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { type AuthTokens, type LoginCredentials, type RegisterCredentials, type User } from '@/types'

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await axios.get<User>('/auth/me')
      return data
    },
    enabled: useAuthStore.getState().isAuthenticated,
  })
}

export function useLogin() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (payload: LoginCredentials) => {
      const { data: token } = await axios.post<AuthTokens>('/auth/login', payload)
      const { data: user } = await axios.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })

      return {
        token: token.access_token,
        user,
      }
    },
    onSuccess: ({ token, user }) => {
      login(token, user)
      toast.success(`Welcome back, ${user.username}.`)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterCredentials) => {
      const { data } = await axios.post<User>('/auth/register', payload)
      return data
    },
    onSuccess: () => {
      toast.success('Account created. You can sign in now.')
    },
  })
}

