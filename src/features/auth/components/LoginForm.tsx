import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/features/auth/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  remember: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const demoAccounts = [
  {
    label: 'Author',
    email: 'ava@author.dev',
    icon: UserCircle2,
  },
  {
    label: 'Reviewer',
    email: 'marcus@reviewer.dev',
    icon: Sparkles,
  },
  {
    label: 'Admin',
    email: 'priya@admin.dev',
    icon: ShieldCheck,
  },
] as const

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      email: 'ava@author.dev',
      password: 'password123',
      remember: true,
    },
  })

  async function loginAs(email: string) {
    await loginMutation.mutateAsync({
      email,
      password: 'password123',
      remember: true,
    })
    navigate('/dashboard')
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await loginMutation.mutateAsync(values)
        navigate('/dashboard')
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" placeholder="you@team.dev" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" placeholder="••••••••" {...register('password')} />
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <Checkbox
            checked={watch('remember')}
            onCheckedChange={(checked) => setValue('remember', Boolean(checked))}
          />
          Remember me
        </label>
        <span className="font-mono text-xs text-zinc-500">Use any seeded account + `password123`</span>
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign in to Reviewly'}
      </Button>

      {import.meta.env.DEV ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">Quick access</p>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                className="justify-start"
                disabled={loginMutation.isPending}
                onClick={() => void loginAs(account.email)}
              >
                <account.icon className="h-4 w-4" />
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="text-center text-sm text-zinc-500">
        New here?{' '}
        <Link to="/register" className="text-primary hover:text-primary/80">
          Create an account
        </Link>
      </p>
    </form>
  )
}
