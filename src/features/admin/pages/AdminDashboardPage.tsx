import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { axios } from '@/lib/axios'
import { formatDate } from '@/lib/utils'
import { PlatformStats } from '@/features/admin/components/PlatformStats'
import { ReviewChart } from '@/features/dashboard/components/ReviewChart'
import { type Submission, type User } from '@/types'

interface ReviewerMetric {
  reviewer: User
  load: number
  stats: {
    totalReviews: number
    avgRating: number
    currentLoad: number
  }
}

interface AdminMetricsResponse {
  totalUsers: number
  activeReviewers: number
  recentRegistrations: User[]
  submissionsByStatus: Array<{ status: string; count: number }>
  reviewerLoads: ReviewerMetric[]
  unassigned: Submission[]
}

export function AdminDashboardPage() {
  const metricsQuery = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: async () => {
      const { data } = await axios.get<AdminMetricsResponse>('/admin/metrics')
      return data
    },
  })

  if (metricsQuery.isLoading || !metricsQuery.data) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Admin"
          title="Platform command center"
          description="Track queue health, staffing, and reviewer load in one place."
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

  const activeReviews = metricsQuery.data.reviewerLoads.reduce((sum, item) => sum + item.load, 0)
  const completionCount = metricsQuery.data.submissionsByStatus
    .filter((item) => item.status === 'approved' || item.status === 'changes_requested')
    .reduce((sum, item) => sum + item.count, 0)
  const totalSubmissions = metricsQuery.data.submissionsByStatus.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform command center"
        description="Track queue health, staffing, and reviewer load in one place."
        actions={
          <Button asChild>
            <Link to="/admin/assignments">Open assignments</Link>
          </Button>
        }
      />

      <PlatformStats
        totalUsers={metricsQuery.data.totalUsers}
        totalSubmissions={totalSubmissions}
        activeReviews={activeReviews}
        completionRate={`${Math.round((completionCount / Math.max(totalSubmissions, 1)) * 100)}%`}
      />

      <div className="grid gap-6 2xl:grid-cols-[1.4fr_0.9fr]">
        <ReviewChart data={metricsQuery.data.submissionsByStatus} title="Submissions by status" />
        <Card>
          <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Unassigned submissions</CardTitle>
              <CardDescription>Items requiring immediate operational attention.</CardDescription>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/admin/assignments">Assign now</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {metricsQuery.data.unassigned.length ? (
              metricsQuery.data.unassigned.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-2xl border border-border bg-background/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-zinc-100">{submission.title}</p>
                      <p className="text-sm text-zinc-500">
                        {submission.language} • {submission.author.username}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={ArrowRight}
                title="Nothing is waiting"
                description="All open work already has reviewer coverage."
                actionLabel="Review staffing"
                onAction={() => undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent registrations</CardTitle>
          <CardDescription>Newest people added to the platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {metricsQuery.data.recentRegistrations.map((user) => (
            <div key={user.id} className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <div>
                  <p className="font-medium text-zinc-100">{user.username}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge status={user.role} />
                <p className="text-xs text-zinc-500">{formatDate(user.created_at)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
