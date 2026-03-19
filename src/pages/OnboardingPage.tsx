import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Check, GitBranch, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ScreenCanvas } from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Dropzone } from '../components/ui/Dropzone'
import { Field, FieldGroup, Input, Textarea } from '../components/ui/Field'
import { cn } from '../lib/cn'

const languageOptions = [
  { dotClass: 'bg-yellow-300', name: 'JavaScript' },
  { dotClass: 'bg-blue-600', name: 'TypeScript' },
  { dotClass: 'bg-sky-700', name: 'Python' },
  { dotClass: 'bg-cyan-500', name: 'Go' },
  { dotClass: 'bg-orange-300', name: 'Rust' },
  { dotClass: 'bg-amber-700', name: 'Java' },
  { dotClass: 'bg-rose-500', name: 'C++' },
  { dotClass: 'bg-red-900', name: 'Ruby' },
  { dotClass: 'bg-orange-500', name: 'Swift' },
  { dotClass: 'bg-violet-500', name: 'Kotlin' },
]

const steps = [
  'Step 1 of 3 — Organization',
  'Step 2 of 3 — Languages',
  'Step 3 of 3 — Profile',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [orgChoice, setOrgChoice] = useState<'create' | 'join'>('create')
  const [inviteCode, setInviteCode] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'TypeScript',
    'Python',
  ])
  const [avatarFileName, setAvatarFileName] = useState('')
  const [displayName, setDisplayName] = useState('Embiid O.')
  const [githubHandle, setGithubHandle] = useState('embiidcodes')
  const [bio, setBio] = useState('Engineering manager shaping thoughtful code review culture.')
  const [showAllLanguages, setShowAllLanguages] = useState(false)

  const nextLabel = currentStep === 3 ? 'Finish Setup' : 'Continue'
  const canContinue = !(currentStep === 1 && orgChoice === 'join' && !inviteCode.trim())
  const visibleLanguages = showAllLanguages
    ? languageOptions
    : languageOptions.filter((language, index) => index < 5 || selectedLanguages.includes(language.name))

  const progress = useMemo(
    () =>
      steps.map((label, index) => ({
        complete: index + 1 < currentStep,
        current: index + 1 === currentStep,
        label,
        step: index + 1,
      })),
    [currentStep],
  )

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language],
    )
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0 sm:p-3">
        <div className="radius-shell mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-[560px] flex-col overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-float sm:min-h-[720px] sm:radius-shell-lg lg:max-w-[680px]">
          <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
            <header className="mb-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="brand">Workspace setup</Badge>
                  <h1 className="mt-3 text-2xl font-semibold text-slate-900">
                    Get your team ready for reviews
                  </h1>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    We&apos;ll set up your organization, tailor the review experience,
                    and personalize your profile in three short steps.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {currentStep}/3
                </span>
              </div>

              <div className="space-y-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      'h-full rounded-full bg-reviewly-indigo transition-all',
                      currentStep === 1
                        ? 'w-1/3'
                        : currentStep === 2
                          ? 'w-2/3'
                          : 'w-full',
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <ol aria-label="Onboarding progress" className="flex gap-3">
                    {progress.map((item) => (
                      <li
                        key={item.step}
                        aria-current={item.current ? 'step' : undefined}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition',
                          item.complete &&
                            'border-reviewly-indigo bg-reviewly-indigo text-white',
                          item.current &&
                          'border-reviewly-indigo text-reviewly-indigo',
                        !item.complete &&
                          !item.current &&
                          'border-slate-300 text-slate-400',
                      )}
                    >
                      {item.complete ? <Check className="h-3.5 w-3.5" /> : item.step}
                      </li>
                      ))}
                  </ol>
                  <span className="text-sm font-medium text-slate-600">
                    {steps[currentStep - 1]}
                  </span>
                </div>
              </div>
            </header>

            <div key={currentStep} className="flex-1 animate-slide-down">
              {currentStep === 1 && (
                <section aria-labelledby="onboarding-step-organization">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900" id="onboarding-step-organization">
                    Welcome to Reviewly
                  </h2>
                  <p className="mb-8 text-slate-500">
                    Let&apos;s get your workspace set up. Would you like to create a
                    new organization or join an existing one?
                  </p>
                  <FieldGroup
                    hint="Choose whether you want to create a new workspace or join an existing one with an invite."
                    legend="Organization setup"
                  >
                    <div className="space-y-4" role="radiogroup">
                      <label className="block cursor-pointer">
                        <input
                          checked={orgChoice === 'create'}
                          className="peer sr-only"
                          name="organization-choice"
                          onChange={() => setOrgChoice('create')}
                          type="radio"
                          value="create"
                        />
                        <Card
                          className={cn(
                            'w-full border-2 p-4 text-left transition peer-focus-visible:ring-2 peer-focus-visible:ring-reviewly-indigo peer-focus-visible:ring-offset-2',
                            orgChoice === 'create'
                              ? 'border-reviewly-indigo bg-indigo-50/50'
                              : 'border-slate-100 bg-slate-50/70 hover:border-indigo-100',
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition',
                                orgChoice === 'create'
                                  ? 'bg-reviewly-indigo text-white'
                                  : 'bg-white text-slate-700',
                              )}
                            >
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                Create Organization
                              </div>
                              <div className="text-sm text-slate-500">
                                Start fresh and invite your team later.
                              </div>
                            </div>
                            <div
                              aria-hidden="true"
                              className={cn(
                                'flex h-5 w-5 items-center justify-center rounded-full border-2',
                                orgChoice === 'create'
                                  ? 'border-reviewly-indigo bg-reviewly-indigo'
                                  : 'border-slate-300',
                              )}
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>
                          </div>
                        </Card>
                      </label>

                      <label className="block cursor-pointer">
                        <input
                          checked={orgChoice === 'join'}
                          className="peer sr-only"
                          name="organization-choice"
                          onChange={() => setOrgChoice('join')}
                          type="radio"
                          value="join"
                        />
                        <Card
                          className={cn(
                            'w-full border-2 p-4 text-left transition peer-focus-visible:ring-2 peer-focus-visible:ring-reviewly-indigo peer-focus-visible:ring-offset-2',
                            orgChoice === 'join'
                              ? 'border-reviewly-indigo bg-indigo-50/50'
                              : 'border-slate-100 bg-slate-50/70 hover:border-indigo-100',
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition',
                                orgChoice === 'join'
                                  ? 'bg-reviewly-indigo text-white'
                                  : 'bg-white text-slate-700',
                              )}
                            >
                              <UserPlus className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                Join with Invite
                              </div>
                              <div className="text-sm text-slate-500">
                                Enter a code to join an existing team.
                              </div>
                            </div>
                            <div
                              aria-hidden="true"
                              className={cn(
                                'flex h-5 w-5 items-center justify-center rounded-full border-2',
                                orgChoice === 'join'
                                  ? 'border-reviewly-indigo bg-reviewly-indigo'
                                  : 'border-slate-300',
                              )}
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>
                          </div>
                        </Card>
                      </label>
                    </div>

                    <div
                      className={cn(
                        'origin-top overflow-hidden transition-all duration-300',
                        orgChoice === 'join'
                          ? 'max-h-40 opacity-100'
                          : 'max-h-0 opacity-0',
                      )}
                    >
                      <Field
                        error={orgChoice === 'join' && !inviteCode.trim() ? 'Add a valid invite code before continuing.' : undefined}
                        hint="Enter your invite code to continue into the shared workspace."
                        id="invite-code"
                        label="Invite Code"
                      >
                        <Input
                          onChange={(event) => setInviteCode(event.target.value)}
                          placeholder="e.g. REV-123-XYZ"
                          type="text"
                          value={inviteCode}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </section>
              )}

              {currentStep === 2 && (
                <section aria-labelledby="onboarding-step-languages">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900" id="onboarding-step-languages">
                    Preferred Languages
                  </h2>
                  <p className="mb-8 text-slate-500">
                    Start with the languages your team reviews most often. You can add
                    the rest later as your workspace grows.
                  </p>
                  <FieldGroup legend="Languages your team reviews most often">
                    <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
                      Choose 2 to 5 languages to tailor the first version of your review queue.
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {visibleLanguages.map((language) => {
                        const active = selectedLanguages.includes(language.name)
                        return (
                          <Button
                            aria-pressed={active}
                            key={language.name}
                            className={cn(
                              'min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium shadow-none',
                              active
                                ? 'border-reviewly-indigo bg-reviewly-indigo text-white hover:bg-indigo-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                            )}
                            onClick={() => toggleLanguage(language.name)}
                            type="button"
                            variant="ghost"
                          >
                            <span className={cn('h-2.5 w-2.5 rounded-full', language.dotClass)} />
                            {language.name}
                          </Button>
                        )
                      })}
                    </div>
                    {!showAllLanguages ? (
                      <Button
                        className="mt-4 w-fit"
                        onClick={() => setShowAllLanguages(true)}
                        type="button"
                        variant="ghost"
                      >
                        Show more languages
                      </Button>
                    ) : null}
                    <p className="mt-4 text-sm text-slate-500">
                      {selectedLanguages.length} selected
                    </p>
                  </FieldGroup>
                </section>
              )}

              {currentStep === 3 && (
                <section aria-labelledby="onboarding-step-profile">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900" id="onboarding-step-profile">
                    Complete Profile
                  </h2>
                  <p className="mb-6 text-slate-500">
                    Last step. Tell us a bit more about yourself so we can tailor
                    the workspace around your workflow.
                  </p>

                  <div className="space-y-5">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-sm">
                        <Dropzone
                          accept="image/*"
                          className="radius-shell"
                          description={
                            avatarFileName
                              ? `Selected file: ${avatarFileName}`
                              : 'Drop an avatar here or choose an image from your computer.'
                          }
                          label="Upload profile photo"
                          onFiles={(files) => setAvatarFileName(files[0]?.name ?? '')}
                        />
                        <p className="mt-2 text-center text-xs text-slate-400">
                          Recommended: 400x400px
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <Field label="Display Name">
                        <Input
                          onChange={(event) => setDisplayName(event.target.value)}
                          type="text"
                          value={displayName}
                        />
                      </Field>

                      <Field label="GitHub Username">
                        <div className="flex min-h-[48px] overflow-hidden rounded-xl border border-slate-300 bg-white">
                          <span className="inline-flex items-center border-r border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                            github.com/
                          </span>
                          <Input
                            className="min-w-0 flex-1 rounded-none border-0 px-4 py-3"
                            onChange={(event) => setGithubHandle(event.target.value)}
                            type="text"
                            value={githubHandle}
                          />
                        </div>
                      </Field>

                      <Field label="Bio">
                        <Textarea
                          onChange={(event) => setBio(event.target.value)}
                          rows={4}
                          value={bio}
                        />
                      </Field>

                      <Card className="border-indigo-100 bg-indigo-50/60">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <GitBranch className="h-4 w-4 text-reviewly-indigo" />
                          Workspace Summary
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl bg-white px-3 py-3 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Workspace
                            </div>
                            <div className="mt-2 text-sm font-medium text-slate-900">
                              {orgChoice === 'create' ? 'New organization' : 'Join with invite'}
                            </div>
                          </div>
                          <div className="rounded-xl bg-white px-3 py-3 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Languages
                            </div>
                            <div className="mt-2 text-sm font-medium text-slate-900">
                              {selectedLanguages.length === 0
                                ? 'None selected'
                                : `${selectedLanguages.length} selected`}
                            </div>
                            {selectedLanguages.length > 0 ? (
                              <div className="mt-1 text-sm text-slate-500">
                                {selectedLanguages.slice(0, 2).join(', ')}
                                {selectedLanguages.length > 2 ? ' +' : ''}
                              </div>
                            ) : null}
                          </div>
                          <div className="rounded-xl bg-white px-3 py-3 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Profile
                            </div>
                            <div className="mt-2 text-sm font-medium text-slate-900">
                              {displayName || 'Your profile'}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              github.com/{githubHandle || 'your-handle'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <footer className="mt-12 border-t border-slate-100 pt-5">
              <div className="mb-4 text-sm text-slate-500">
                {currentStep === 1
                  ? 'Choose how this workspace should start.'
                  : currentStep === 2
                    ? 'Pick the languages your team reaches for most often.'
                    : 'Finish the profile details reviewers will recognize.'}
              </div>
              <div className="flex flex-col-reverse gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                <div className="flex items-center">
                  {currentStep > 1 ? (
                    <Button
                      className="w-full text-slate-600 hover:bg-transparent hover:text-slate-900 sm:w-auto sm:justify-start"
                      onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                      type="button"
                      variant="ghost"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div className="hidden h-11 sm:block" />
                  )}
                </div>
                <Button
                  disabled={!canContinue}
                  block
                  onClick={() => {
                    if (currentStep === 3) {
                      navigate('/dashboard')
                      return
                    }
                    setCurrentStep((step) => Math.min(3, step + 1))
                  }}
                  size="lg"
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
                  type="button"
                  variant="primary"
                  className="sm:min-w-[160px] sm:w-auto"
                >
                  {nextLabel}
                </Button>
              </div>
              {!canContinue ? (
                <p aria-live="polite" className="mt-3 text-sm text-amber-600" role="alert">
                  Add a valid invite code before continuing.
                </p>
              ) : null}
            </footer>
          </div>
        </div>
      </ScreenCanvas>
    </div>
  )
}
