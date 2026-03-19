import { useState } from 'react'
import { ArrowLeft, Github, Save, UserCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, DesktopViewport, ScreenCanvas, WorkspaceShell } from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Field'
import { Toast } from '../components/ui/Toast'

export function ProfileSettingsPage() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('Embiid O.')
  const [githubHandle, setGithubHandle] = useState('embiidcodes')
  const [bio, setBio] = useState('Engineering manager shaping thoughtful code review culture.')
  const [toast, setToast] = useState<string | null>(null)

  const handleSave = () => {
    setToast('Profile settings updated.')
    window.setTimeout(() => setToast(null), 2200)
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0">
        <DesktopViewport className="min-h-[calc(100svh-3rem)] surface-page">
          <header className="border-b border-neutral-200 bg-white">
            <WorkspaceShell wide className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  aria-label="Go back"
                  className="text-text-body"
                  onClick={() => navigate('/dashboard')}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="text-sm text-text-muted">Account</div>
                  <h1 className="text-2xl font-bold tracking-tight text-text-strong">
                    Profile Settings
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => navigate('/reviewers/sarah-connor')} type="button" variant="ghost">
                  View public profile
                </Button>
                <Button leadingIcon={<Save className="h-4 w-4" />} onClick={handleSave} type="button" variant="primary">
                  Save profile
                </Button>
              </div>
            </WorkspaceShell>
          </header>

          <WorkspaceShell wide className="px-4 py-6 lg:px-6 lg:py-8">
            <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-6">
                <Card elevated className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 text-2xl" initials="EM" />
                    <div className="mt-4 text-xl font-semibold text-text-strong">{displayName}</div>
                    <div className="mt-1 text-sm text-text-muted">@{githubHandle || 'github-handle'}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 surface-subtle px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      Public preview
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-body">
                      This is the profile teammates and requesters will recognize when they browse reviewers.
                    </p>
                  </div>
                </Card>

                <Card elevated className="space-y-3">
                  <div className="text-sm font-semibold text-text-strong">Related settings</div>
                  <Button block onClick={() => navigate('/settings/organization')} type="button" variant="outline">
                    Organization settings
                  </Button>
                  <Button block onClick={() => navigate('/notifications')} type="button" variant="ghost">
                    Notifications
                  </Button>
                </Card>
              </aside>

              <main className="space-y-6">
                <Card elevated className="space-y-6">
                  <div>
                    <Badge variant="brand">Personal profile</Badge>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-strong">
                      Keep your reviewer identity current
                    </h2>
                    <p className="mt-2 max-w-[60ch] text-sm leading-6 text-text-body">
                      Update the fields teammates rely on when they decide whether you are the right reviewer for a request.
                    </p>
                  </div>

                  <Field label="Display Name">
                    <Input onChange={(event) => setDisplayName(event.target.value)} type="text" value={displayName} />
                  </Field>

                  <Field
                    label={
                      <span className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-text-muted" />
                        GitHub Handle
                      </span>
                    }
                  >
                    <Input onChange={(event) => setGithubHandle(event.target.value)} type="text" value={githubHandle} />
                  </Field>

                  <Field
                    hint="A short summary of the work you are best at reviewing."
                    label={
                      <span className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-text-muted" />
                        Bio
                      </span>
                    }
                  >
                    <Textarea onChange={(event) => setBio(event.target.value)} rows={5} value={bio} />
                  </Field>
                </Card>
              </main>
            </div>
          </WorkspaceShell>
          <Toast message={toast ?? ''} visible={Boolean(toast)} />
        </DesktopViewport>
      </ScreenCanvas>
    </div>
  )
}
