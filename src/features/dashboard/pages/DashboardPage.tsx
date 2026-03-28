import { CheckCircle2, Clock3, Layers3, Sparkles, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuthStore } from '@/store/authStore'
import { useSubmissions } from '@/features/submissions/hooks/useSubmissions'
import { useReviewQueue } from '@/features/reviews/hooks/useReviewQueue'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { RecentSubmissions } from '@/features/dashboard/components/RecentSubmissions'
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed'
import { SubmissionCard } from '@/features/submissions/components/SubmissionCard'
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { getDashboardActivity } from '@/mocks/data'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const submissionsQuery = useSubmissions({ page: 1, size: 20 })
  const reviewsQuery = useReviewQueue()

  const activity = user ? getDashboardActivity(user) : []

  if (!user) {
    return null
  }

  if (user.role === 'admin') {
    return <AdminDashboardPage />
  }

  if (submissionsQuery.isLoading || reviewsQuery.isLoading || !submissionsQuery.data || !reviewsQuery.data) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={user.role}
          title="Dashboard"
          description="Overview of the work that matters most right now."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[148px]" />
          ))}
        </div>
        <Skeleton className="h-[360px]" />
      </div>
    )
  }

  const submissions = submissionsQuery.data.items
  const reviews = reviewsQuery.data.items

  if (user.role === 'author') {
    const completed = submissions.filter((submission) =>
      ['approved', 'changes_requested', 'closed'].includes(submission.status)
    ).length

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Author"
          title="Your review pipeline"
          description="Track open feedback loops, reviewer activity, and recently shipped work."
          actions={
            <Button asChild>
              <Link to="/submissions/new">New submission</Link>
            </Button>
          }
        />

        {!submissions.length ? (
          <EmptyState
            icon={Sparkles}
            title="Start your first async review"
            description="Create a submission, upload code, and point reviewers at the exact areas you want sharpened."
            actionLabel="Create submission"
            onAction={() => {
              window.location.assign('/submissions/new')
            }}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total submissions" value={submissions.length} helper="All authored work" icon={Layers3} />
              <StatCard
                label="Pending review"
                value={submissions.filter((submission) => submission.status === 'pending').length}
                helper="Waiting on your selected lecturer"
                icon={Clock3}
              />
              <StatCard
                label="In review"
                value={submissions.filter((submission) => submission.status === 'in_review').length}
                helper="Reviewer currently active"
                icon={TimerReset}
              />
              <StatCard label="Completed" value={completed} helper="Closed loop this cycle" icon={CheckCircle2} />
            </div>

            <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
              <RecentSubmissions submissions={submissions.slice(0, 5)} />
              <ActivityFeed items={activity} />
            </div>
          </>
        )}
      </div>
    )
  }

  const assignedCount = reviews.filter((review) => review.status === 'assigned').length
  const inProgressCount = reviews.filter((review) => review.status === 'in_progress').length
  const completedCount = reviews.filter((review) => review.status === 'submitted').length
  const avgRating =
    reviews
      .filter((review) => review.rating)
      .reduce((sum, review) => sum + (review.rating ?? 0), 0) /
    Math.max(
      reviews.filter((review) => review.rating).length,
      1
    )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reviewer"
        title="Review queue overview"
        description="Stay on top of submissions students sent to you, keep in-progress reviews moving, and close feedback loops quickly."
        actions={
          <Button asChild>
            <Link to="/reviews">Open review queue</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending with me" value={assignedCount} helper="New student submissions waiting" icon={Layers3} />
        <StatCard label="In progress" value={inProgressCount} helper="Actively being reviewed" icon={Clock3} />
        <StatCard label="Completed this month" value={completedCount} helper="Submitted recently" icon={CheckCircle2} />
        <StatCard label="Avg rating given" value={avgRating.toFixed(1)} helper="Across submitted reviews" icon={Sparkles} />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Queue</h2>
          {submissions.slice(0, 4).map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
        <ActivityFeed items={activity} />
      </div>
    </div>
  )
}
