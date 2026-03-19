import { useState } from 'react'
import { Check, Code2, Eye, EyeOff, Github, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ScreenCanvas } from '../components/showcase'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input } from '../components/ui/Field'
import { Toast } from '../components/ui/Toast'
import { cn } from '../lib/cn'

export function AuthPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [currentTab, setCurrentTab] = useState<'login' | 'register'>('login')
  const [selectedRole, setSelectedRole] = useState<'submitter' | 'reviewer'>(
    'submitter',
  )
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  const isRegister = currentTab === 'register'

  const handleSubmit = () => {
    setLoading(true)
    window.requestAnimationFrame(() => {
      setLoading(false)
      const role = selectedRole === 'reviewer' ? 'REVIEWER' : 'SUBMITTER'
      auth.login(role)
      navigate(currentTab === 'login' ? '/dashboard' : '/onboarding')
    })
  }

  const handleForgotPassword = () => {
    setAuthMessage(
      'Password reset is handled through your workspace admin or support@reviewly.app.',
    )
    window.setTimeout(() => setAuthMessage(null), 2600)
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <ScreenCanvas className="flex min-h-[calc(100svh-2rem)] items-center justify-center bg-transparent p-0 sm:min-h-[calc(100svh-5rem)] sm:p-6">
        <div className="radius-shell w-full max-w-[32.5rem] overflow-hidden border border-neutral-200 bg-white text-text-strong shadow-float sm:radius-shell-lg">
          <header className="border-b border-neutral-200 px-4 pb-5 pt-6 text-center sm:px-8 sm:pb-6 sm:pt-10">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                <Code2 className="h-7 w-7" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold tracking-tight text-text-strong">
                  Reviewly
                </h1>
                <p className="text-sm leading-5 text-text-muted">
                  Secure access for your review workspace
                </p>
              </div>
            </div>
            <p className="text-center text-sm text-text-muted">
              Used by 2,000+ engineers for structured async code review
            </p>
          </header>

          <nav className="relative mt-2 flex border-b border-neutral-200 px-4 sm:mt-4 sm:px-8">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                className={cn(
                  'touch-target flex-1 py-4 text-sm font-medium transition',
                  currentTab === tab
                    ? 'text-text-strong'
                    : 'text-text-muted hover:text-text-strong',
                )}
                onClick={() => setCurrentTab(tab)}
                type="button"
              >
                {tab === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
            <div
              className={cn(
                'absolute bottom-0 h-[3px] w-1/2 bg-brand transition-transform duration-300',
                currentTab === 'login' ? 'translate-x-0' : 'translate-x-full',
              )}
            />
          </nav>

          <div className="safe-bottom-lg p-4 sm:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-xl font-semibold text-text-strong">
                {isRegister ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-sm leading-6 text-text-muted">
                {currentTab === 'login'
                  ? 'Continue where your team left off and jump straight into active reviews.'
                  : 'Set up your account, choose your role, and start collaborating with your team.'}
              </p>
            </div>

            <section className="space-y-3">
              <p className="text-sm leading-6 text-text-muted">
                Use GitHub for the fastest sign-in, or continue with email if your
                workspace requires it.
              </p>
              <Button
                block
                leadingIcon={<Github className="h-5 w-5" />}
                onClick={() => {
                  auth.login('SUBMITTER')
                  navigate(currentTab === 'login' ? '/dashboard' : '/onboarding')
                }}
                size="lg"
                type="button"
                variant="secondary"
              >
                Continue with GitHub
              </Button>

              <div className="my-6 flex items-center text-neutral-200">
                <div className="flex-1 border-t border-neutral-200" />
                <span className="px-4 text-xs uppercase tracking-[0.18em] text-text-muted">
                  Or use email instead
                </span>
                <div className="flex-1 border-t border-neutral-200" />
              </div>
            </section>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                handleSubmit()
              }}
            >
              <Field
                label="Email Address"
              >
                <Input
                  placeholder="you@company.com"
                  type="email"
                />
              </Field>

              <Field
                label={
                  <div className="flex items-center justify-between gap-3">
                    <span>Password</span>
                    <Button
                      className="min-h-[32px] px-2 py-1 text-xs text-text-muted hover:bg-transparent hover:text-text-strong"
                      onClick={handleForgotPassword}
                      type="button"
                      variant="ghost"
                    >
                      Forgot password?
                    </Button>
                  </div>
                }
              >
                <div className="relative">
                  <Input
                    className="pr-11"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 h-9 w-9 min-h-[36px] min-w-[36px] -translate-y-1/2 text-neutral-400 hover:bg-transparent hover:text-text-strong"
                    size="icon"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                    variant="ghost"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Field>

              <div className="space-y-3 pt-2">
                <span className="ml-1 text-sm font-medium text-text-body">Continue as</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(['submitter', 'reviewer'] as const).map((role) => {
                    const active = selectedRole === role
                    return (
                      <Card
                        aria-checked={active}
                        key={role}
                        className={cn(
                          'relative cursor-pointer border p-4 text-left text-text-strong',
                          active
                            ? 'border-brand bg-brand-50/50'
                            : 'border-neutral-200 bg-white hover:border-brand-200',
                        )}
                        elevated={active}
                        onClick={() => setSelectedRole(role)}
                        role="radio"
                      >
                        {active ? (
                          <div className="absolute right-4 top-4">
                            <Check className="h-4 w-4 text-brand" />
                          </div>
                        ) : null}
                        <div className="mb-3 text-brand">
                          {role === 'submitter' ? (
                            <GraduationCap className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-text-strong">
                          {role === 'submitter' ? 'Submitter' : 'Reviewer'}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-text-body">
                          {role === 'submitter'
                            ? 'Request reviews for your code.'
                            : 'Audit and approve PR submissions.'}
                        </p>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {isRegister && (
                <div className="animate-fade-up space-y-4">
                  <Field label="Username">
                    <Input
                      placeholder="gh_handle"
                      type="text"
                    />
                  </Field>

                  <Field label="Confirm Password">
                    <Input
                      placeholder="Confirm your password"
                      type="password"
                    />
                  </Field>

                </div>
              )}

              <Button
                block
                className="mt-8 font-bold"
                loading={loading}
                size="lg"
                type="submit"
                variant="primary"
              >
                {isRegister ? 'Create account' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
        <Toast message={authMessage ?? ''} visible={Boolean(authMessage)} />
      </ScreenCanvas>
    </div>
  )
}
