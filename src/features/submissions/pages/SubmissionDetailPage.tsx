import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionStatusTimeline } from '@/features/submissions/components/SubmissionStatusTimeline'
import { ReviewThread } from '@/features/reviews/components/ReviewThread'
import { useReview } from '@/features/reviews/hooks/useReview'
import { useCloseSubmission, useSubmission } from '@/features/submissions/hooks/useSubmission'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function SubmissionDetailPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const submissionId = Number(id)
  const submissionQuery = useSubmission(submissionId)
  const reviewQuery = useReview(submissionId)
  const closeMutation = useCloseSubmission()
  const [activeFileId, setActiveFileId] = useState<number | null>(null)
  const [selectedLine, setSelectedLine] = useState<number | null>(null)

  const submission = submissionQuery.data
  const review = reviewQuery.data
  const activeFile = useMemo(() => {
    const files = submission?.files ?? []
    if (!files.length) return null
    return files.find((file) => file.id === activeFileId) ?? files[0]
  }, [activeFileId, submission?.files])

  if (submissionQuery.isLoading || !submission) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14" />
        <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-[720px]" />
          <Skeleton className="h-[720px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Submission detail"
        title={submission.title}
        description={submission.description}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={submission.status} />
            {user?.id === submission.author.id && submission.status === 'pending' ? (
              <ConfirmDialog
                trigger={<Button variant="ghost">Close submission</Button>}
                title="Close this submission?"
                description="This ends the request before review starts."
                actionLabel="Close submission"
                onConfirm={() => closeMutation.mutate(submission.id)}
              />
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>Browse uploaded code and inspect any inline feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={String(activeFile?.id ?? submission.files[0]?.id)} onValueChange={(value) => setActiveFileId(Number(value))}>
              <TabsList className="mb-4 flex h-auto flex-wrap gap-2 bg-transparent p-0">
                {submission.files.map((file) => (
                  <TabsTrigger key={file.id} value={String(file.id)} className="border border-border bg-mutedSurface/60">
                    {file.filename}
                  </TabsTrigger>
                ))}
              </TabsList>
              {submission.files.map((file) => (
                <TabsContent value={String(file.id)} key={file.id}>
                  <CodeBlock
                    file={file}
                    comments={review?.comments ?? []}
                    highlightedLine={selectedLine}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>Who submitted it, who owns the review, and when it changed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Author</p>
                <div className="mt-3 flex items-center gap-3">
                  <UserAvatar user={submission.author} />
                  <div>
                    <p className="font-medium text-zinc-100">{submission.author.username}</p>
                    <p className="text-sm text-zinc-500">{submission.author.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Reviewer</p>
                {submission.reviewer ? (
                  <div className="mt-3 flex items-center gap-3">
                    <UserAvatar user={submission.reviewer} />
                    <div>
                      <p className="font-medium text-zinc-100">{submission.reviewer.username}</p>
                      <p className="text-sm text-zinc-500">
                        Assigned {formatRelativeTime(submission.updated_at)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">Still waiting for assignment.</p>
                )}
              </div>

              <div className="grid gap-3 rounded-2xl border border-border bg-background/40 p-4 text-sm text-zinc-400">
                <div className="flex justify-between gap-3">
                  <span>Language</span>
                  <span className="text-zinc-100">{submission.language}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Urgency</span>
                  <span className="capitalize text-zinc-100">{submission.urgency ?? 'normal'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Created</span>
                  <span className="text-zinc-100">{formatDate(submission.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
              <CardDescription>Lifecycle from draft to final outcome.</CardDescription>
            </CardHeader>
            <CardContent>
              <SubmissionStatusTimeline status={submission.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Review thread</CardTitle>
                <CardDescription>Line-level discussion and final feedback.</CardDescription>
              </div>
              {submission.status === 'approved' || submission.status === 'changes_requested' ? (
                <Button variant="secondary" asChild>
                  <Link to={`/reviews/${submission.id}`}>Open editor view</Link>
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {review?.summary ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <StatusBadge status={review.verdict === 'approve' ? 'approved' : 'changes_requested'} />
                    <p className="text-sm text-zinc-500">{review.rating}/5</p>
                  </div>
                  <p className="text-sm text-zinc-300">{review.summary}</p>
                </div>
              ) : null}
              <ReviewThread comments={review?.comments ?? []} onSelectLine={setSelectedLine} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
