import Axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { authStore } from '@/store/authStore'
import { type ApiError, type ApiValidationError } from '@/types'

function normalizeError(error: AxiosError<ApiError | { detail?: string; errors?: ApiValidationError[] }>) {
  const status = error.response?.status
  const data = error.response?.data
  const detail = data && 'detail' in data ? data.detail : undefined
  const message = data && 'message' in data ? data.message : undefined
  const errors = data?.errors ?? []

  if (status === 422) {
    const validationError: ApiError = {
      message: 'Please correct the highlighted fields.',
      status,
      errors,
    }
    return validationError
  }

  if (status === 500) {
    return {
      message: 'Something went wrong on our side. Please try again in a moment.',
      status,
    } satisfies ApiError
  }

  return {
    message: detail ?? message ?? error.message ?? 'Request failed.',
    status,
  } satisfies ApiError
}

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

axios.interceptors.request.use((config) => {
  const { token } = authStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status

    if (status === 401) {
      toast.error('Your session expired. Please sign in again.')
      authStore.getState().logout()
      return Promise.reject(normalizeError(error))
    }

    const normalized = normalizeError(error)
    toast.error(normalized.message)
    return Promise.reject(normalized)
  }
)
