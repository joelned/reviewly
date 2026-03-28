import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRightLeft, Search, Sparkles, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignReviewerModal } from '@/features/admin/components/AssignReviewerModal'
import { useSubmissions } from '@/features/submissions/hooks/useSubmissions'
import { axios } from '@/lib/axios'
import { type Submission, type User } from '@/types'

interface ReviewerOption extends User {
  load: number
  stats: {
    totalReviews: number
    avgRating: number
    currentLoad: number
  }
}

export function AssignmentsPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'unassigned' | 'assigned'>('unassigned')
  const [search, setSearch] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [optimisticAssignments, setOptimisticAssignments] = useState<Record<number, ReviewerOption>>({})

  const submissionsQuery = useSubmissions({ page: 1, size: 50 })
  const reviewersQuery = useQuery({
    queryKey: ['admin', 'reviewers'],
    queryFn: async () => {
      const { data } = await axios.get<ReviewerOption[]>('/admin/reviewers')
      return data
    },
  })

  const assignMutation = useMutation({
    mutationFn: async ({ submissionId, reviewerId }: { submissionId: number; reviewerId: number }) => {
      const { data } = await axios.post<Submission>('/admin/assignments', { submissionId, reviewerId })
      return data
    },
    onMutate: ({ submissionId, reviewerId }) => {
      const reviewer = reviewersQuery.data?.find((item) => item.id === reviewerId)
      if (reviewer) {
        setOptimisticAssignments((current) => ({ ...current, [submissionId]: reviewer }))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviewers'] })
      setSelectedSubmission(null)
    },
  })

  const rankedReviewers = useMemo(() => {
    return [...(reviewersQuery.data ?? [])]
      .sort((left, right) => {
        const leftScore = left.stats.avgRating * 2 - left.stats.currentLoad
        const rightScore = right.stats.avgRating * 2 - right.stats.currentLoad
        return rightScore - leftScore
      })
      .map((reviewer) => reviewer)
  }, [reviewersQuery.data])

  const recommendedReviewer = rankedReviewers[0]

  const submissions = useMemo(() => {
    const items = submissionsQuery.data?.items ?? []
    return items
      .map((submission) => ({
        ...submission,
        reviewer: optimisticAssignments[submission.id] ?? submission.reviewer,
      }))
      .filter((submission) => {
        const matchesSearch =
          !search ||
          [submission.title, submission.author.username, submission.language]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        if (!matchesSearch) {
          return false
        }

        return tab === 'unassigned' ? !submission.reviewer : Boolean(submission.reviewer)
      })
  }, [optimisticAssignments, search, submissionsQuery.data?.items, tab])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Assignments"
        description="Balance reviewer load, triage unassigned work, and keep the queue moving."
        actions={
          recommendedReviewer ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-zinc-200">
              Best fit right now: <span className="font-medium text-white">{recommendedReviewer.username}</span>
            </div>
          ) : undefined
        }
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as 'unassigned' | 'assigned')}>
        <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <TabsList>
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
          </TabsList>
          <div className="relative w-full lg:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search submissions or authors"
              className="pl-9"
            />
          </div>
        </div>

        {(['unassigned', 'assigned'] as const).map((currentTab) => (
          <TabsContent key={currentTab} value={currentTab}>
            <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{currentTab === 'unassigned' ? 'Work awaiting assignment' : 'Assigned queue'}</CardTitle>
                  <CardDescription>
                    Drag a submission onto a reviewer or use the modal to assign manually.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submissionsQuery.isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)
                  ) : submissions.length ? (
                    submissions.map((submission) => (
                      <div
                        key={submission.id}
                        draggable={currentTab === 'unassigned'}
                        onDragStart={(event) => event.dataTransfer.setData('text/submission-id', String(submission.id))}
                        className="rounded-2xl border border-border bg-background/40 p-4"
                      >
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                          <div className="space-y-2">
                            <p className="font-medium text-zinc-100">{submission.title}</p>
                            <p className="text-sm text-zinc-500">
                              {submission.author.username} • {submission.language} • urgency {submission.urgency}
                            </p>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={submission.status} />
                              {submission.reviewer ? <span className="text-xs text-zinc-500">{submission.reviewer.username}</span> : null}
                            </div>
                          </div>
                          {currentTab === 'unassigned' ? (
                            <div className="flex flex-wrap gap-2">
                              {recommendedReviewer ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    assignMutation.mutate({
                                      submissionId: submission.id,
                                      reviewerId: recommendedReviewer.id,
                                    })
                                  }
                                >
                                  <Sparkles className="h-4 w-4" />
                                  Assign best fit
                                </Button>
                              ) : null}
                              <Button variant="secondary" size="sm" onClick={() => setSelectedSubmission(submission)}>
                                Assign
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={ArrowRightLeft}
                      title={`No ${currentTab} submissions`}
                      description="Adjust the current filters or wait for more work to enter the queue."
                      actionLabel="Clear filters"
                      onAction={() => setSearch('')}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available reviewers</CardTitle>
                  <CardDescription>Each card shows active load and historical output.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviewersQuery.isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28" />)
                  ) : (
                    rankedReviewers.map((reviewer, index) => (
                      <div
                        key={reviewer.id}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          const submissionId = Number(event.dataTransfer.getData('text/submission-id'))
                          if (submissionId) {
                            assignMutation.mutate({ submissionId, reviewerId: reviewer.id })
                          }
                        }}
                        className="rounded-2xl border border-border bg-background/40 p-4"
                      >
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-zinc-100">{reviewer.username}</p>
                              <StatusBadge status={reviewer.role} />
                              {index === 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
                                  <TrendingUp className="h-3 w-3" />
                                  Best fit
                                </span>
                              ) : reviewer.stats.currentLoad === 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                                  <Sparkles className="h-3 w-3" />
                                  Available now
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm text-zinc-500">
                              {reviewer.stats.totalReviews} total reviews • avg rating {reviewer.stats.avgRating}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-mutedSurface px-3 py-2 text-sm text-zinc-300">
                            {reviewer.load} active
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AssignReviewerModal
        open={Boolean(selectedSubmission)}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
        reviewers={reviewersQuery.data ?? []}
        assigning={assignMutation.isPending}
        onAssign={(reviewerId) => {
          if (!selectedSubmission) return
          assignMutation.mutate({ submissionId: selectedSubmission.id, reviewerId })
        }}
      />
    </div>
  )
}
