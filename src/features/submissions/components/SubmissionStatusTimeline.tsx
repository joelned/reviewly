import { CheckCircle2, CircleDashed } from 'lucide-react'
import { type SubmissionStatus } from '@/types'

const steps: Array<{ key: SubmissionStatus | 'done'; label: string }> = [
  { key: 'draft', label: 'Draft' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_review', label: 'In Review' },
  { key: 'done', label: 'Outcome' },
]

export function SubmissionStatusTimeline({ status }: { status: SubmissionStatus }) {
  const outcomeLabel = status === 'changes_requested' ? 'Changes Requested' : status === 'approved' ? 'Approved' : 'Closed'
  const currentIndex =
    status === 'approved' || status === 'changes_requested' || status === 'closed'
      ? 3
      : steps.findIndex((step) => step.key === status)

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const complete = index <= currentIndex
        const label = step.key === 'done' ? outcomeLabel : step.label

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-mutedSurface">
                {complete ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <CircleDashed className="h-4 w-4 text-zinc-500" />
                )}
              </div>
              {index < steps.length - 1 ? <div className="mt-2 h-8 w-px bg-border" /> : null}
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-zinc-100">{label}</p>
              <p className="text-xs text-zinc-500">
                {complete ? 'Completed or active in the current workflow.' : 'Waiting for this stage.'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

