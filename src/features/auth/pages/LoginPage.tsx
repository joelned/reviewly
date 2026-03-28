import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="absolute inset-0 grid-background opacity-30" />
      <Card className="relative w-full max-w-[400px]">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 shadow-glow">
            <span className="font-mono text-lg font-bold text-primary">R</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Reviewly</CardTitle>
            <CardDescription>Structured async code review for engineering teams.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

