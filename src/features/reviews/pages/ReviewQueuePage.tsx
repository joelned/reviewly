import { FileSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionCard } from '@/features/submissions/components/SubmissionCard'
import { useReviewQueue } from '@/features/reviews/hooks/useReviewQueue'
import { type ReviewStatus } from '@/types'

export function ReviewQueuePage() {
  const [tab, setTab] = useState<ReviewStatus>('assigned')
  const [page, setPage] = useState(1)
  const reviewsQuery = useReviewQueue(page, 10, tab)

  const items = reviewsQuery.data?.items ?? []

  useEffect(() => {
    setPage(1)
  }, [tab])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reviewer"
        title="Review Queue"
        description="Oldest-first review work sent to you by authors, organized by current state."
        actions={
          <Button variant="secondary" onClick={() => setTab('in_progress')}>
            Focus in-progress
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as ReviewStatus)}>
        <TabsList>
          <TabsTrigger value="assigned">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="submitted">Completed</TabsTrigger>
        </TabsList>
        {(['assigned', 'in_progress', 'submitted'] as ReviewStatus[]).map((status) => (
          <TabsContent key={status} value={status}>
            {reviewsQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-32" />
                ))}
              </div>
            ) : !items.length ? (
              <EmptyState
                icon={FileSearch}
                title={`No ${status === 'assigned' ? 'pending' : status.replace('_', ' ')} reviews`}
                description="When authors submit work to you, it will show up here with quick access to the editor."
                actionLabel="Refresh queue"
                onAction={() => {
                  reviewsQuery.refetch()
                }}
              />
            ) : (
              <div className="space-y-4">
                {items.map((review) =>
                  review.submission ? (
                    <SubmissionCard
                      key={review.id}
                      submission={review.submission}
                      href={`/reviews/${review.submission.id}`}
                    />
                  ) : null
                )}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    Page {reviewsQuery.data?.page} of {reviewsQuery.data?.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      disabled={(reviewsQuery.data?.page ?? 1) <= 1}
                      onClick={() => setPage((current) => Math.max(current - 1, 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={(reviewsQuery.data?.page ?? 1) >= (reviewsQuery.data?.pages ?? 1)}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
