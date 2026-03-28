import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { appRouter } from '@/routes'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'

export function App() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              'border border-border bg-mutedSurface text-foreground shadow-card backdrop-blur-xl',
            error: 'border-destructive/40',
            success: 'border-success/40',
          },
        }}
      />
    </QueryClientProvider>
  )
}

