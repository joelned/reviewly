import { zodResolver } from '@hookform/resolvers/zod'
import { FileCode2, SearchCode } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRegister } from '@/features/auth/hooks/useAuth'

const schema = z
  .object({
    email: z.string().email('Enter a valid email address.'),
    username: z.string().min(2, 'Username must be at least 2 characters.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
    role: z.enum(['author', 'reviewer']),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
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
      role: 'author',
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await registerMutation.mutateAsync({
          email: values.email,
          username: values.username,
          password: values.password,
          role: values.role,
        })
        navigate('/login')
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input id="register-email" type="email" placeholder="you@team.dev" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-username">Username</Label>
        <Input id="register-username" placeholder="Ada Lovelace" {...register('username')} />
        {errors.username ? <p className="text-sm text-destructive">{errors.username.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input id="register-password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-confirm-password">Confirm password</Label>
          <Input
            id="register-confirm-password"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <Label>I am joining as</Label>
        <RadioGroup
          value={watch('role')}
          onValueChange={(value) => setValue('role', value as FormValues['role'], { shouldValidate: true })}
          className="grid gap-3"
        >
          <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-background/40 p-4">
            <RadioGroupItem value="author" />
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <FileCode2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-zinc-100">Author</p>
              <p className="text-sm text-zinc-500">I want my code reviewed.</p>
            </div>
          </label>
          <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-background/40 p-4">
            <RadioGroupItem value="reviewer" />
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10">
              <SearchCode className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-100">Reviewer</p>
              <p className="text-sm text-zinc-500">I want to review code.</p>
            </div>
          </label>
        </RadioGroup>
        {errors.role ? <p className="text-sm text-destructive">{errors.role.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  )
}
