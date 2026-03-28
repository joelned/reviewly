import { FileSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionCard } from '@/features/submissions/components/SubmissionCard'
import { useReviewQueue } from '@/features/reviews/hooks/useReviewQueue'
import { useSubmissions } from '@/features/submissions/hooks/useSubmissions'
import { type ReviewStatus } from '@/types'

export function ReviewQueuePage() {
  const [tab, setTab] = useState<ReviewStatus>('assigned')
  const reviewsQuery = useReviewQueue()
  const submissionsQuery = useSubmissions({ page: 1, size: 20 })

  const submissionMap = useMemo(() => {
    return new Map((submissionsQuery.data?.items ?? []).map((submission) => [submission.id, submission]))
  }, [submissionsQuery.data?.items])

  const items = (reviewsQuery.data?.items ?? [])
    .filter((review) => review.status === tab)
    .map((review) => submissionMap.get(review.submission_id))
    .filter(Boolean)

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
            {reviewsQuery.isLoading || submissionsQuery.isLoading ? (
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
                  submissionsQuery.refetch()
                }}
              />
            ) : (
              <div className="space-y-4">
                {items.map((submission) =>
                  submission ? <SubmissionCard key={submission.id} submission={submission} /> : null
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
