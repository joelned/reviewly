import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CopyPlus,
  ExternalLink,
  Github,
  LoaderCircle,
  Upload,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DesktopViewport, ScreenCanvas, WorkspaceShell } from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Dropzone } from '../components/ui/Dropzone'
import { Field, FieldGroup, Input, Select, Textarea } from '../components/ui/Field'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cn } from '../lib/cn'

const focusAreas = ['Readability', 'Performance', 'Security', 'Testability']

export function NewSubmissionPage() {
  const navigate = useNavigate()
  const [composerStep, setComposerStep] = useState<1 | 2 | 3>(1)
  const [source, setSource] = useState<'paste' | 'github'>('paste')
  const [language, setLanguage] = useState('TypeScript')
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [reviewFocus, setReviewFocus] = useState<string[]>(['Readability'])
  const [assignedReviewer, setAssignedReviewer] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<'public' | 'org' | 'private'>('public')
  const [deadlineEnabled, setDeadlineEnabled] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [prLoaded, setPrLoaded] = useState(false)
  const [prLoading, setPrLoading] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [importedFileName, setImportedFileName] = useState('')
  const [showAllFocusAreas, setShowAllFocusAreas] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>(
    'idle',
  )

  const lines = useMemo(
    () => Array.from({ length: Math.max(6, code.split('\n').length) }, (_, index) => index + 1),
    [code],
  )

  const toggleFocus = (item: string) => {
    setReviewFocus((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    )
  }

  const handleSourceChange = (nextSource: 'paste' | 'github') => {
    setSource(nextSource)
    setPrLoading(false)
    setPrLoaded(false)
    if (composerStep > 1) {
      setComposerStep(1)
    }
  }

  const hasSourceReady = source === 'paste' ? Boolean(code.trim()) : prLoaded
  const hasCoreDetails =
    Boolean(title.trim()) && (source === 'paste' ? Boolean(code.trim()) : prLoaded)
  const canAdvanceFromStep =
    composerStep === 1
      ? source === 'github'
        ? prLoaded
        : true
      : composerStep === 2
        ? hasCoreDetails
        : true
  const canSubmit =
    hasCoreDetails &&
    reviewFocus.length > 0 &&
    (!deadlineEnabled || Boolean(deadline))
  const visibleFocusAreas = showAllFocusAreas
    ? focusAreas
    : focusAreas.filter((item, index) => index < 2 || reviewFocus.includes(item))
  const stepSummary =
    composerStep === 1
      ? 'Pick the source format reviewers should use.'
      : composerStep === 2
        ? 'Add only the context and code needed for a strong review.'
        : 'Finish access and focus so the request is easy to triage.'

  const handleFetch = () => {
    setPrLoading(true)
    setPrLoaded(false)
    window.requestAnimationFrame(() => {
      setPrLoading(false)
      setPrLoaded(true)
    })
  }

  const handleSaveDraft = () => {
    setDraftSaved(true)
    window.setTimeout(() => setDraftSaved(false), 2200)
  }

  const handleSubmit = () => {
    if (submitState === 'loading') return
    if (!canSubmit) return
    setSubmitState('loading')
    window.requestAnimationFrame(() => {
      setSubmitState('success')
      window.requestAnimationFrame(() => {
        navigate('/submissions/402')
      })
    })
  }

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tagName = target.tagName.toLowerCase()
      return (
        target.isContentEditable ||
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select'
      )
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return
      if (composerStep !== 3) return
      if (submitState === 'loading') return
      if (isTypingTarget(event.target) && event.target instanceof HTMLTextAreaElement) return
      event.preventDefault()
      handleSubmit()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [submitState, composerStep, canSubmit])

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0">
        <DesktopViewport className="relative overflow-hidden">
          <div className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Go back"
                className="rounded-full p-2 transition hover:bg-neutral-100"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="flex text-xs text-text-muted">
                  <span>Dashboard</span>
                  <span className="mx-1">/</span>
                  <span className="font-medium text-text-strong">
                    New Submission
                  </span>
                </div>
                <h1 className="truncate text-lg font-semibold tracking-tight">
                  New Submission
                </h1>
              </div>
            </div>
          </div>

          <WorkspaceShell wide className="px-4 py-6 pb-48 sm:py-8 lg:px-6 xl:pb-28">
            <section className="mb-8">
              <Card className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Badge variant="brand">Step {composerStep} of 3</Badge>
                    <h2 className="mt-3 text-xl font-semibold text-text-strong">
                      {composerStep === 1
                        ? 'Choose your source'
                        : composerStep === 2
                          ? 'Add submission details'
                          : 'Configure review settings'}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                      {composerStep === 1
                        ? 'Start with the smallest decision: how reviewers should receive this change.'
                        : composerStep === 2
                          ? 'Now give reviewers the exact context they need without making them dig for it.'
                          : 'Finish with access, focus areas, and optional timing so the request is easy to triage.'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        'h-2 rounded-full transition',
                        composerStep >= step ? 'bg-brand' : 'bg-neutral-200',
                      )}
                    />
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Source', 1, 'Choose how the review should start.'],
                    ['Details', 2, 'Add title, code, and reviewer context.'],
                    ['Settings', 3, 'Keep access and focus lightweight.'],
                  ].map(([label, step, body]) => (
                    <button
                      key={label}
                      className={cn(
                        'rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60',
                        composerStep === step
                          ? 'border-brand surface-brand-soft'
                          : 'border-neutral-200 surface-subtle text-text-body',
                      )}
                      disabled={
                        (step === 2 && source === 'github' && !prLoaded) ||
                        (step === 3 && !hasCoreDetails)
                      }
                      onClick={() => {
                        if (step === 2 && source === 'github' && !prLoaded) return
                        if (step === 3 && !hasCoreDetails) return
                        setComposerStep(step as 1 | 2 | 3)
                      }}
                      type="button"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                        Step {step}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-text-strong">{label}</div>
                      <div className="mt-1 text-sm leading-5 text-text-muted">{body}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </section>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_320px]">
            <form className="space-y-8">
              {composerStep === 1 && (
                <Card className="space-y-6">
                  <SectionHeader
                    title="Submission source"
                    action={<Badge variant="neutral">Start here</Badge>}
                    description="Choose the smallest path to good feedback. You can switch methods before you move to the next step."
                  />
                  <SegmentedControl
                    ariaLabel="Choose a submission source"
                    onChange={handleSourceChange}
                    options={[
                      { label: 'Paste code', value: 'paste' },
                      { label: 'GitHub PR', value: 'github' },
                    ]}
                    value={source}
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="space-y-2" surface="subtle">
                      <div className="text-sm font-semibold text-text-strong">Paste code</div>
                      <p className="text-sm leading-6 text-text-muted">
                        Best when you want feedback on a focused snippet or one risky change.
                      </p>
                    </Card>
                    <Card className="space-y-2" surface="subtle">
                      <div className="text-sm font-semibold text-text-strong">GitHub PR</div>
                      <p className="text-sm leading-6 text-text-muted">
                        Best when reviewers need commit context, file counts, and surrounding diff history.
                      </p>
                    </Card>
                  </div>

                  {source === 'github' ? (
                    <Card className="space-y-5" surface="subtle">
                      <SectionHeader
                        title="GitHub import"
                        action={<Badge variant="neutral">Best for full pull-request context</Badge>}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Repository">
                          <Input defaultValue="acme/reviewly" placeholder="owner/repository" type="text" />
                        </Field>
                        <Field label="PR Number">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Input defaultValue="402" inputMode="numeric" type="number" />
                            <Button
                              loading={prLoading}
                              onClick={handleFetch}
                              type="button"
                              variant="outline"
                            >
                              Fetch
                            </Button>
                          </div>
                        </Field>
                      </div>

                      {prLoading ? (
                        <Card elevated className="space-y-3">
                          <div className="h-4 w-32 animate-shimmer rounded bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
                          <div className="h-3 w-48 animate-shimmer rounded bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
                          <div className="h-10 animate-shimmer rounded bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
                        </Card>
                      ) : null}

                      {prLoaded && !prLoading ? (
                        <Card elevated>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h4 className="font-semibold text-text-strong">
                                feat: implement auth middleware
                              </h4>
                              <p className="text-xs text-text-muted">
                                Opened by <span className="font-medium">johndoe</span> •
                                2 hours ago
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono">
                              <span className="font-bold text-green-600">+142</span>
                              <span className="font-bold text-danger-600">-12</span>
                              <span className="rounded bg-neutral-100 px-2 py-0.5">
                                4 files
                              </span>
                            </div>
                          </div>
                        </Card>
                      ) : null}
                    </Card>
                  ) : (
                    <Card className="space-y-5" surface="subtle">
                      <SectionHeader
                        title="Paste a focused change"
                        action={<Badge variant="neutral">Fastest route to feedback</Badge>}
                      />
                      <Dropzone
                        accept=".ts,.tsx,.js,.jsx,.py,.rs,.go,.txt"
                        description={
                          importedFileName
                            ? `Imported ${importedFileName}. You can refine the code in the next step.`
                            : 'Drop a code file here to preload the editor before you continue.'
                        }
                        label="Drag and drop a file"
                        onFiles={(files) => {
                          const file = files[0]
                          if (!file) return
                          setImportedFileName(file.name)
                          file.text().then((contents) => {
                            setCode(contents)
                            const baseName = file.name.replace(/\.[^/.]+$/, '')
                            if (!title.trim()) {
                              setTitle(baseName)
                            }
                          })
                        }}
                      />
                      <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-text-body">
                        You can still continue without a file and paste the final code in the next step.
                      </div>
                    </Card>
                  )}
                </Card>
              )}

              {composerStep === 2 && (
                <div className="space-y-6">
                  <Card className="space-y-6">
                    <SectionHeader
                      title="Core context"
                      action={<Badge variant="neutral">What reviewers will see first</Badge>}
                      description="Start with the smallest context package that still lets someone understand the change."
                    />
                    <Field
                      label={
                        <div className="flex items-end justify-between">
                          <span className="text-sm font-semibold">
                            Submission Title
                          </span>
                          <span
                            className={cn(
                              'text-xs',
                              title.length >= 100
                                ? 'text-danger-500'
                                : 'text-text-muted',
                            )}
                          >
                            {title.length} / 100
                          </span>
                        </div>
                      }
                    >
                      <Input
                        maxLength={100}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Briefly describe the change reviewers should evaluate"
                        type="text"
                        value={title}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                      <Field
                        label={
                          <div className="flex items-center gap-1.5 text-sm font-semibold">
                            Description
                            <Badge className="rounded-md" variant="neutral">
                              Markdown supported
                            </Badge>
                            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                          </div>
                        }
                      >
                        <Textarea
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Explain the goal, the risky parts, and the kind of feedback you want."
                          rows={5}
                          value={description}
                        />
                      </Field>

                      <Card className="space-y-3" surface="subtle">
                        <div className="text-sm font-semibold text-text-strong">Required to continue</div>
                        <ul className="space-y-2 text-sm leading-6 text-text-muted">
                          <li>Give the change a precise title.</li>
                          <li>Add the code or PR context reviewers will evaluate.</li>
                          <li>Leave a short description if the risk is not obvious.</li>
                        </ul>
                      </Card>
                    </div>
                  </Card>

                  <Card className="space-y-6">
                    <SectionHeader
                      title={source === 'paste' ? 'Code to review' : 'PR context'}
                      action={
                        <Badge variant="neutral">
                          {source === 'paste' ? 'Keep the scope focused' : 'Context attached from GitHub'}
                        </Badge>
                      }
                    />

                    <div className="space-y-2">
                      <Field className="w-full md:max-w-xs" id="submission-language" label="Language">
                        <div className="relative">
                          <Select
                            id="submission-language"
                            onChange={(event) => setLanguage(event.target.value)}
                            value={language}
                          >
                            <option>TypeScript</option>
                            <option>JavaScript</option>
                            <option>Python</option>
                            <option>Rust</option>
                            <option>Go</option>
                          </Select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </Field>
                    </div>

                    {source === 'paste' ? (
                      <div className="space-y-2">
                        <label className="text-ui-label block" htmlFor="submission-code">
                          Code Content
                        </label>
                        <p className="text-ui-meta" id="submission-code-hint">
                          Paste the exact code you want feedback on. Keep the scope focused so reviewers can respond quickly.
                        </p>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                          <div className="relative bg-neutral-50 pl-14">
                            <div className="absolute inset-y-0 left-0 w-12 border-r border-neutral-200 bg-neutral-100 pt-4 text-right font-mono text-sm text-neutral-400">
                              {lines.map((line) => (
                                <div key={line} className="pr-4 leading-6">
                                  {line}
                                </div>
                              ))}
                            </div>
                            <textarea
                              aria-describedby="submission-code-hint"
                              className="min-h-[320px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm leading-6 outline-none placeholder:text-neutral-400"
                              id="submission-code"
                              onChange={(event) => setCode(event.target.value)}
                              placeholder="Paste the focused code snippet you want reviewed..."
                              value={code}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Card className="space-y-3" surface="subtle">
                        <div className="text-sm font-semibold text-text-strong">
                          Pull request context
                        </div>
                        <p className="text-sm leading-6 text-text-muted">
                          Reviewers will receive the fetched PR context. Use the description above to guide them toward the areas that matter most.
                        </p>
                        {prLoaded ? (
                          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-text-body">
                            GitHub PR context is ready and will be attached to this submission.
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700">
                            Fetch a PR in step 1 before you continue.
                          </div>
                        )}
                      </Card>
                    )}
                  </Card>
                </div>
              )}

              {composerStep === 3 && (
                <Card className="space-y-6">
                <SectionHeader
                  title="Review Settings"
                  action={<Badge variant="neutral">Visibility, focus areas, reminders</Badge>}
                  description="Only the final delivery choices are left. Keep the configuration as light as the review requires."
                />

                <FieldGroup
                  hint="Choose who can access this submission and participate in the review."
                  legend="Visibility"
                  className="grid gap-3 md:grid-cols-3"
                >
                  {[
                    {
                      value: 'public' as const,
                      body: 'Anyone can view and review this code.',
                      icon: <Upload className="h-5 w-5" />,
                      title: 'Public',
                    },
                    {
                      value: 'org' as const,
                      body: 'Limited to members of your organization.',
                      icon: <Github className="h-5 w-5" />,
                      title: 'Org Only',
                    },
                    {
                      value: 'private' as const,
                      body: 'Only invited reviewers can see this.',
                      icon: <CopyPlus className="h-5 w-5" />,
                      title: 'Private',
                    },
                  ].map((card) => (
                    <label key={card.title} className="block cursor-pointer">
                      <input
                        className="peer sr-only"
                        checked={visibility === card.value}
                        name="visibility"
                        onChange={() => setVisibility(card.value)}
                        type="radio"
                        value={card.value}
                      />
                      <Card className="rounded-2xl border-2 border-neutral-100 transition peer-checked:border-brand peer-checked:bg-brand-50/50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2">
                        <div className="mb-2 text-brand">{card.icon}</div>
                        <p className="text-sm font-bold">{card.title}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {card.body}
                        </p>
                      </Card>
                    </label>
                  ))}
                </FieldGroup>

                <Card className="space-y-4" surface="subtle">
                  <SectionHeader
                    title="Reviewer assignment"
                    action={<Badge variant="neutral">Optional</Badge>}
                    description="Assign a reviewer now when you already know who should see this request first."
                  />
                  <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-text-strong">Sarah Connor</div>
                        <p className="mt-1 text-sm leading-6 text-text-muted">
                          Strong fit for React, TypeScript, and frontend architecture reviews.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => navigate('/reviewers/sarah-connor')}
                          type="button"
                          variant="ghost"
                        >
                          Preview profile
                        </Button>
                        <Button
                          onClick={() =>
                            setAssignedReviewer((current) =>
                              current === 'Sarah Connor' ? null : 'Sarah Connor',
                            )
                          }
                          type="button"
                          variant={assignedReviewer === 'Sarah Connor' ? 'soft' : 'outline'}
                        >
                          {assignedReviewer === 'Sarah Connor' ? 'Assigned' : 'Assign reviewer'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <FieldGroup legend="Review Focus Areas">
                  <p className="text-ui-meta">
                    Start with the recommended focus area, then add more only if the review truly needs them.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {visibleFocusAreas.map((item, index) => (
                      <Button
                        aria-pressed={reviewFocus.includes(item)}
                        key={item}
                        className={cn(
                          'justify-start gap-2 px-3 py-3 text-left text-xs font-medium',
                          reviewFocus.includes(item)
                            ? 'border-brand bg-brand-50/60 text-text-strong'
                            : 'border-neutral-200 hover:border-brand-200',
                        )}
                        onClick={() => toggleFocus(item)}
                        type="button"
                        variant="outline"
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded border',
                            reviewFocus.includes(item)
                              ? 'border-brand bg-brand text-white'
                              : 'border-neutral-300',
                          )}
                        >
                          {reviewFocus.includes(item) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="flex items-center gap-2">
                          {item}
                          {index === 0 ? <Badge variant="neutral">Recommended</Badge> : null}
                        </span>
                      </Button>
                    ))}
                  </div>
                  {focusAreas.length > visibleFocusAreas.length ? (
                    <Button
                      className="w-fit"
                      onClick={() => setShowAllFocusAreas(true)}
                      type="button"
                      variant="ghost"
                    >
                      Show more focus areas
                    </Button>
                  ) : null}
                </FieldGroup>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">
                        Set Review Deadline
                      </div>
                      <div className="text-xs text-text-muted">
                        Automatic reminders will be sent
                      </div>
                    </div>
                    <Button
                      aria-checked={deadlineEnabled}
                      aria-controls="submission-deadline"
                      aria-label="Set review deadline"
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full px-0 py-0 transition',
                        deadlineEnabled ? 'bg-brand' : 'bg-neutral-200',
                      )}
                      onClick={() => setDeadlineEnabled((value) => !value)}
                      role="switch"
                      type="button"
                      variant="ghost"
                    >
                      <span
                        className={cn(
                          'inline-block h-5 w-5 rounded-full bg-white shadow transition',
                          deadlineEnabled ? 'translate-x-5' : 'translate-x-0',
                        )}
                      />
                    </Button>
                  </div>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      deadlineEnabled ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <Input
                      className="sm:max-w-xs"
                      disabled={!deadlineEnabled}
                      id="submission-deadline"
                      onChange={(event) => setDeadline(event.target.value)}
                      type="date"
                      value={deadline}
                    />
                  </div>
                </div>
                <Card className="space-y-4" surface="subtle">
                  <Button
                    block
                    aria-expanded={tipsOpen}
                    className="justify-between px-0 text-left hover:bg-transparent"
                    onClick={() => setTipsOpen((value) => !value)}
                    type="button"
                    variant="ghost"
                  >
                    <span className="text-sm font-semibold text-text-strong">
                      How to get better feedback
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-neutral-400 transition-transform',
                        tipsOpen && 'rotate-180',
                      )}
                    />
                  </Button>
                  {tipsOpen ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-text-strong">Clarity</div>
                        <p className="mt-2 text-sm leading-6 text-text-muted">
                          Reviewers respond faster when the title and description explain the
                          goal, risk, and expected feedback.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-text-strong">Scope</div>
                        <p className="mt-2 text-sm leading-6 text-text-muted">
                          Smaller submissions are easier to review thoroughly and usually get
                          higher-quality comments.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-text-strong">Follow-up</div>
                        <p className="mt-2 text-sm leading-6 text-text-muted">
                          Set a deadline only when timing matters so the team can prioritize
                          urgent review work correctly.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </Card>
              </Card>
              )}
            </form>
              <aside className="hidden space-y-6 xl:sticky xl:top-24 xl:block xl:self-start">
                <Card elevated className="space-y-4">
                  <SectionHeader
                    title="Progress summary"
                    description="Keep the current step and the minimum next action visible while you work."
                  />
                  <div className="rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                      Right now
                    </div>
                    <div className="mt-2 text-sm font-semibold text-text-strong">{stepSummary}</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['Current step', composerStep === 1 ? 'Source' : composerStep === 2 ? 'Details' : 'Settings'],
                      ['Source', source === 'paste' ? 'Paste code' : 'GitHub PR'],
                      ['Language', language],
                      ['Imported file', importedFileName || 'None'],
                      ['Reviewer', assignedReviewer ?? 'Assign later'],
                      ['Visibility', visibility === 'org' ? 'Organization only' : visibility],
                      ['Focus areas', `${reviewFocus.length} selected`],
                      ['Deadline', deadlineEnabled && deadline ? deadline : 'Not set'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3"
                      >
                        <span className="text-sm text-text-muted">{label}</span>
                        <span className="text-right text-sm font-medium text-text-strong">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card elevated className="space-y-4">
                  <SectionHeader title="Ready to move on?" />
                  <div className="space-y-3">
                    {([
                      ['Source ready', source === 'github' ? hasSourceReady : true],
                      ['Details added', hasCoreDetails],
                      ['Ready to submit', canSubmit],
                    ] as Array<[string, boolean]>).map(([label, complete]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                      >
                        <span className="text-sm text-text-body">{label}</span>
                        <Badge variant={complete ? 'success' : 'neutral'}>
                          {complete ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          </WorkspaceShell>

          <footer className="safe-bottom-lg pointer-events-none fixed inset-x-0 bottom-0 z-20 px-4 py-4">
            <div className="pointer-events-auto mx-auto flex max-w-[1360px] flex-col gap-3 rounded-[1.5rem] border border-neutral-200 bg-white/95 px-4 py-4 shadow-[0_-10px_30px_rgba(16,23,27,0.08)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    composerStep === 1
                      ? navigate('/dashboard')
                      : setComposerStep((step) => (step === 1 ? 1 : step === 2 ? 1 : 2))
                  }
                  type="button"
                  variant="ghost"
                >
                  {composerStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                {composerStep < 3 ? (
                  <Button
                    disabled={!canAdvanceFromStep}
                    onClick={() =>
                      setComposerStep((step) => (step === 1 ? 2 : 3))
                    }
                    type="button"
                    variant="secondary"
                  >
                    Continue
                  </Button>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {composerStep === 3 ? (
                  <>
                    <Button
                      onClick={handleSaveDraft}
                      type="button"
                      variant="outline"
                    >
                      Save Draft
                    </Button>
                    <Button
                      disabled={!canSubmit}
                      loading={submitState === 'loading'}
                      onClick={handleSubmit}
                      shortcutHint="Ctrl+Enter"
                      type="button"
                      variant="primary"
                    >
                      Submit for Review
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
            <div aria-live="polite" className="min-h-[1.5rem]" role="status">
              {draftSaved ? (
                <p className="animate-fade-in text-sm text-success-600">
                  Draft saved. You can come back and finish this submission later.
                </p>
              ) : composerStep === 1 && source === 'github' && !prLoaded ? (
                <p className="animate-fade-in text-sm text-warning-600">
                  Fetch the pull request first so reviewers get the right context.
                </p>
              ) : composerStep < 3 && !canAdvanceFromStep ? (
                <p className="animate-fade-in text-sm text-warning-600">
                  Add the core submission details before continuing.
                </p>
              ) : null}
            </div>
          </footer>

          {submitState !== 'idle' && (
            <div aria-live="polite" className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90" role="status">
              {submitState === 'loading' ? (
                <>
                  <LoaderCircle className="mb-4 h-12 w-12 animate-spin text-brand" />
                  <p className="text-sm text-text-muted">
                    Preparing your submission for review...
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold">Submission created!</h2>
                  <p className="text-sm text-text-muted">
                    Routing your reviewers to the right context...
                  </p>
                </div>
              )}
            </div>
          )}
        </DesktopViewport>
      </ScreenCanvas>
    </div>
  )
}
