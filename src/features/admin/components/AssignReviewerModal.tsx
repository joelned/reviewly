import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { type User } from '@/types'

interface ReviewerOption extends User {
  load: number
  stats: {
    totalReviews: number
    avgRating: number
    currentLoad: number
  }
}

interface AssignReviewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reviewers: ReviewerOption[]
  onAssign: (reviewerId: number) => void
  assigning?: boolean
}

export function AssignReviewerModal({
  open,
  onOpenChange,
  reviewers,
  onAssign,
  assigning,
}: AssignReviewerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign reviewer</DialogTitle>
          <DialogDescription>Compare reviewer load and quality signals before assigning work.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {reviewers.map((reviewer) => (
            <div
              key={reviewer.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-100">{reviewer.username}</p>
                  <StatusBadge status={reviewer.role} />
                </div>
                <p className="text-sm text-zinc-400">
                  {reviewer.stats.totalReviews} total reviews • avg rating {reviewer.stats.avgRating} • current load{' '}
                  {reviewer.stats.currentLoad}
                </p>
              </div>
              <Button onClick={() => onAssign(reviewer.id)} disabled={assigning}>
                Assign
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
