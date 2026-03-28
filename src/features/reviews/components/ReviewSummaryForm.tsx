import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { RatingInput } from '@/features/reviews/components/RatingInput'
import { type ReviewVerdict, type SubmitReviewPayload } from '@/types'

const schema = z.object({
  verdict: z.enum(['approve', 'request_changes']),
  summary: z.string().min(50, 'Summary must be at least 50 characters.'),
  rating: z.number().min(1, 'Please add a rating.').max(5),
})

type FormValues = z.infer<typeof schema>

interface ReviewSummaryFormProps {
  defaultValues?: Partial<SubmitReviewPayload>
  onSubmit: (values: SubmitReviewPayload) => void
  submitting?: boolean
  formId?: string
  storageKey?: string
}

function readStoredDraft(storageKey?: string) {
  if (!storageKey) {
    return null
  }

  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as Partial<FormValues>
  } catch {
    return null
  }
}

export function ReviewSummaryForm({
  defaultValues,
  onSubmit,
  submitting,
  formId = 'review-summary-form',
  storageKey,
}: ReviewSummaryFormProps) {
  const storedDraft = readStoredDraft(storageKey)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      verdict:
        (storedDraft?.verdict as ReviewVerdict | undefined) ??
        (defaultValues?.verdict as ReviewVerdict | undefined) ??
        undefined,
      summary: storedDraft?.summary ?? defaultValues?.summary ?? '',
      rating: storedDraft?.rating ?? defaultValues?.rating ?? 0,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (!storageKey) {
      return
    }

    window.localStorage.setItem(storageKey, JSON.stringify(watchedValues))
  }, [storageKey, watchedValues])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Summary</CardTitle>
        <CardDescription>Final verdict, written feedback, and rating for the author.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id={formId} className="space-y-6" onSubmit={handleSubmit((values) => onSubmit(values))}>
          {storageKey ? (
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-zinc-300">
              Draft autosaves locally while you write.
            </div>
          ) : null}
          <div className="space-y-3">
            <Label>Overall verdict</Label>
            <RadioGroup
              value={watch('verdict')}
              onValueChange={(value) => setValue('verdict', value as ReviewVerdict, { shouldValidate: true })}
              className="grid gap-3 md:grid-cols-2"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/40 p-4">
                <RadioGroupItem value="approve" />
                <div>
                  <p className="font-medium text-zinc-100">Approve</p>
                  <p className="text-sm text-zinc-500">The submission is ready to move forward.</p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/40 p-4">
                <RadioGroupItem value="request_changes" />
                <div>
                  <p className="font-medium text-zinc-100">Request changes</p>
                  <p className="text-sm text-zinc-500">The author needs to revise before approval.</p>
                </div>
              </label>
            </RadioGroup>
            {errors.verdict ? <p className="text-sm text-destructive">{errors.verdict.message}</p> : null}
          </div>

          <div className="space-y-3">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Summarize the strongest feedback, risks, and recommended next steps."
              className="min-h-[140px]"
              {...register('summary')}
            />
            {errors.summary ? <p className="text-sm text-destructive">{errors.summary.message}</p> : null}
          </div>

          <div className="space-y-3">
            <Label>Rating</Label>
            <RatingInput value={watch('rating')} onChange={(value) => setValue('rating', value, { shouldValidate: true })} />
            {errors.rating ? <p className="text-sm text-destructive">{errors.rating.message}</p> : null}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isValid || submitting}>
              {submitting ? 'Submitting review...' : 'Submit review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
