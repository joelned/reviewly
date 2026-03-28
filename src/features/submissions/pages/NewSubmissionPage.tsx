import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadZone } from '@/features/submissions/components/FileUploadZone'
import { languageOptions, urgencyOptions } from '@/lib/constants'
import { useAvailableReviewers, useCreateSubmission } from '@/features/submissions/hooks/useSubmissions'
import { cn } from '@/lib/utils'
import { type SubmissionFile, type SubmissionUrgency } from '@/types'

const DRAFT_STORAGE_KEY = 'reviewly-new-submission-draft'

const schema = z.object({
  title: z.string().min(4, 'Title is required.'),
  description: z.string().min(20, 'Description should explain the change.'),
  language: z.string().min(1, 'Choose a language.'),
  files: z.array(z.any()).min(1, 'Add at least one file or pasted snippet.'),
  reviewer_id: z.number().min(1, 'Choose a lecturer to review this submission.'),
  focus_area: z.string().min(10, 'Tell reviewers what to focus on.'),
  urgency: z.enum(['low', 'normal', 'high']),
})

type FormValues = z.infer<typeof schema>

const steps = [
  { title: 'Basic info', fields: ['title', 'description', 'language'] as const },
  { title: 'Files', fields: ['files'] as const },
  { title: 'Select lecturer', fields: ['reviewer_id'] as const },
  { title: 'Review preferences', fields: ['focus_area', 'urgency'] as const },
]

export function NewSubmissionPage() {
  const navigate = useNavigate()
  const createSubmission = useCreateSubmission()
  const reviewersQuery = useAvailableReviewers()
  const [step, setStep] = useState(0)
  const storedDraft = (() => {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as Partial<FormValues>
    } catch {
      return null
    }
  })()
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      title: storedDraft?.title ?? '',
      description: storedDraft?.description ?? '',
      language: storedDraft?.language ?? 'TypeScript',
      files: storedDraft?.files ?? [],
      reviewer_id: storedDraft?.reviewer_id ?? 0,
      focus_area: storedDraft?.focus_area ?? '',
      urgency: storedDraft?.urgency ?? 'normal',
    },
  })
  const watchedValues = watch()

  useEffect(() => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(watchedValues))
  }, [watchedValues])

  async function handleNext() {
    const valid = await trigger(steps[step].fields)
    if (valid) {
      setStep((current) => Math.min(current + 1, steps.length - 1))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Author"
        title="New Submission"
        description="Package the context reviewers need: what changed, what files matter, and where to focus."
      />

      <Card>
        <CardContent className="space-y-8 p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((currentStep, index) => (
                <div key={currentStep.title} className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                      index <= step ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-mutedSurface text-zinc-500'
                    }`}
                  >
                    {index < step ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{currentStep.title}</p>
                    <p className="text-xs text-zinc-500">Step {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
            <Progress value={((step + 1) / steps.length) * 100} />
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-zinc-300">
              Draft autosaves locally while you work.
            </div>
          </div>

          <form
            className="space-y-8"
            onSubmit={handleSubmit(async ({ files, ...values }) => {
              const submission = await createSubmission.mutateAsync({
                ...values,
                files: files as SubmissionFile[],
              })
              window.localStorage.removeItem(DRAFT_STORAGE_KEY)
              navigate(`/submissions/${submission.id}`)
            })}
          >
            {step === 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="submission-title">Title</Label>
                  <Input id="submission-title" placeholder="Refactor payment webhook retries" {...register('title')} />
                  {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="submission-description">Description</Label>
                  <Textarea
                    id="submission-description"
                    placeholder="Explain what changed and what kind of feedback you want."
                    {...register('description')}
                  />
                  {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={watch('language')}
                    onValueChange={(value) => setValue('language', value, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language ? <p className="text-sm text-destructive">{errors.language.message}</p> : null}
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-3">
                <FileUploadZone
                  files={watch('files') as SubmissionFile[]}
                  onChange={(files) => setValue('files', files as FormValues['files'], { shouldValidate: true })}
                />
                {errors.files ? <p className="text-sm text-destructive">{errors.files.message as string}</p> : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-background/40 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-zinc-100">Choose your lecturer</p>
                      <p className="text-sm text-zinc-400">
                        Select the reviewer you want from your team. Once you submit, that lecturer will immediately
                        see this request in their pending review queue.
                      </p>
                    </div>
                  </div>
                </div>

                {reviewersQuery.isLoading ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-40" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {(reviewersQuery.data ?? []).map((reviewer) => {
                      const isSelected = watch('reviewer_id') === reviewer.id

                      return (
                        <button
                          key={reviewer.id}
                          type="button"
                          onClick={() => setValue('reviewer_id', reviewer.id, { shouldValidate: true })}
                          className={cn(
                            'rounded-2xl border p-5 text-left transition-all duration-200',
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-glow'
                              : 'border-border bg-background/40 hover:border-primary/30 hover:bg-primary/5'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold text-zinc-100">{reviewer.username}</p>
                                {reviewer.stats.currentLoad === 0 ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                                    <Sparkles className="h-3 w-3" />
                                    Available
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-sm text-zinc-400">{reviewer.email}</p>
                            </div>
                            <div
                              className={cn(
                                'h-4 w-4 rounded-full border',
                                isSelected ? 'border-primary bg-primary' : 'border-zinc-600'
                              )}
                            />
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Current load</p>
                              <p className="mt-1 text-sm font-medium text-zinc-100">{reviewer.stats.currentLoad}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Total reviews</p>
                              <p className="mt-1 text-sm font-medium text-zinc-100">{reviewer.stats.totalReviews}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Avg rating</p>
                              <p className="mt-1 text-sm font-medium text-zinc-100">{reviewer.stats.avgRating}</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
                {errors.reviewer_id ? <p className="text-sm text-destructive">{errors.reviewer_id.message}</p> : null}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="focus-area">What should reviewers focus on?</Label>
                  <Textarea
                    id="focus-area"
                    placeholder="Call out risk areas, architectural tradeoffs, or specific questions."
                    {...register('focus_area')}
                  />
                  {errors.focus_area ? <p className="text-sm text-destructive">{errors.focus_area.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select
                    value={watch('urgency')}
                    onValueChange={(value) =>
                      setValue('urgency', value as SubmissionUrgency, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map((urgency) => (
                        <SelectItem key={urgency} value={urgency}>
                          {urgency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
              >
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button type="button" onClick={() => void handleNext()}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={createSubmission.isPending}>
                  {createSubmission.isPending ? 'Submitting...' : 'Create submission'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
