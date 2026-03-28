import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, Keyboard, MessageSquareMore } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ReviewSummaryForm } from '@/features/reviews/components/ReviewSummaryForm'
import { ReviewThread } from '@/features/reviews/components/ReviewThread'
import { useAddReviewComment, useReview, useSubmitReview } from '@/features/reviews/hooks/useReview'
import { useSubmission } from '@/features/submissions/hooks/useSubmission'
import { type SubmitReviewPayload } from '@/types'

const REVIEW_DRAFT_STORAGE_PREFIX = 'reviewly-review-summary-draft'

export function ReviewEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const submissionId = Number(id)
  const submissionQuery = useSubmission(submissionId)
  const reviewQuery = useReview(submissionId)
  const submission = submissionQuery.data
  const review = reviewQuery.data
  const [activeFileId, setActiveFileId] = useState<number | null>(null)
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [commentDraft, setCommentDraft] = useState('')
  const [pendingPayload, setPendingPayload] = useState<SubmitReviewPayload | null>(null)
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null)
  const addCommentMutation = useAddReviewComment(submissionId)
  const submitReviewMutation = useSubmitReview(review?.id ?? 0, submissionId)

  const activeFile = useMemo(() => {
    const files = submission?.files ?? []
    if (!files.length) return null
    return files.find((file) => file.id === activeFileId) ?? files[0]
  }, [activeFileId, submission?.files])

  async function handleAddComment() {
    if (!selectedLine || !activeFile || !commentDraft.trim()) {
      return
    }

    await addCommentMutation.mutateAsync({
      file_id: activeFile.id,
      line_number: selectedLine,
      content: commentDraft,
    })
    setCommentDraft('')
  }

  useEffect(() => {
    function handleKeyboardShortcuts(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTypingTarget = tag === 'input' || tag === 'textarea' || target?.isContentEditable

      if (isTypingTarget || !activeFile) {
        return
      }

      const totalLines = activeFile.content.split('\n').length

      if (event.key === 'j') {
        event.preventDefault()
        setSelectedLine((current) => Math.min((current ?? 1) + 1, totalLines))
      }

      if (event.key === 'k') {
        event.preventDefault()
        setSelectedLine((current) => Math.max((current ?? 1) - 1, 1))
      }

      if (event.key === 'c' && selectedLine) {
        event.preventDefault()
        commentInputRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setSelectedLine(null)
        setCommentDraft('')
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcuts)
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [activeFile, selectedLine])

  const activeFileComments = activeFile
    ? review?.comments.filter((comment) => comment.file_id === activeFile.id) ?? []
    : review?.comments ?? []

  const totalLines = activeFile ? activeFile.content.split('\n').length : 1

  if (submissionQuery.isLoading || reviewQuery.isLoading || !submission || !review) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Skeleton className="h-16" />
          <Skeleton className="h-[760px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Reviewer"
          title={submission.title}
          description={`Review for ${submission.author.username}`}
          actions={
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
              <Button variant="secondary" asChild>
                <Link to="/reviews">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button type="submit" form="review-summary-form" disabled={submitReviewMutation.isPending}>
                Submit review
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 2xl:grid-cols-[1.4fr_0.8fr]">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Files</CardTitle>
                <CardDescription>Click line numbers to leave inline feedback.</CardDescription>
              </div>
              <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background/50 px-4 py-2 sm:w-auto">
                <UserAvatar user={submission.author} className="h-9 w-9" />
                <div>
                  <p className="text-sm font-medium text-zinc-100">{submission.author.username}</p>
                  <p className="text-xs text-zinc-500">{submission.language}</p>
                </div>
              </div>
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
                  <TabsContent key={file.id} value={String(file.id)}>
                    <CodeBlock
                      file={file}
                      comments={review.comments}
                      onLineClick={setSelectedLine}
                      highlightedLine={selectedLine}
                      focusedLine={selectedLine}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Inline annotation</CardTitle>
                    <CardDescription>Drop line-specific notes into the right gutter.</CardDescription>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-3.5 w-3.5 text-primary" />
                      <span>`j` / `k` move, `c` comments, `Esc` clears</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border bg-background/40 p-4">
                  <p className="text-sm text-zinc-500">
                    {selectedLine ? `Commenting on line ${selectedLine}` : 'Select a line number to start a comment.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedLine((current) => Math.max((current ?? 1) - 1, 1))}
                    disabled={!selectedLine}
                  >
                    <ChevronUp className="h-4 w-4" />
                    Previous line
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedLine((current) => Math.min((current ?? 1) + 1, totalLines))}
                    disabled={!selectedLine}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Next line
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment-draft">Comment</Label>
                  <Textarea
                    ref={commentInputRef}
                    id="comment-draft"
                    placeholder="Flag edge cases, readability issues, or safer alternatives."
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => void handleAddComment()} disabled={!selectedLine || !commentDraft.trim()}>
                    Add inline comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threaded comments</CardTitle>
                <CardDescription>Existing feedback for this submission.</CardDescription>
              </CardHeader>
              <CardContent>
                {review.comments.length ? (
                  <ReviewThread comments={activeFileComments} onSelectLine={setSelectedLine} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-background/40 p-6 text-center text-sm text-zinc-500">
                    <MessageSquareMore className="mx-auto mb-3 h-6 w-6 text-primary" />
                    No comments yet for this file.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <ReviewSummaryForm
          formId="review-summary-form"
          defaultValues={{
            summary: review.summary,
            verdict: review.verdict,
            rating: review.rating,
          }}
          storageKey={`${REVIEW_DRAFT_STORAGE_PREFIX}-${submissionId}`}
          submitting={submitReviewMutation.isPending}
          onSubmit={(values) => setPendingPayload(values)}
        />

        <AlertDialog open={Boolean(pendingPayload)} onOpenChange={(open) => !open && setPendingPayload(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit this review?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone. The author will immediately see the verdict, summary, and inline comments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (!pendingPayload) return
                  await submitReviewMutation.mutateAsync(pendingPayload)
                  window.localStorage.removeItem(`${REVIEW_DRAFT_STORAGE_PREFIX}-${submissionId}`)
                  setPendingPayload(null)
                  navigate('/reviews')
                }}
              >
                Confirm submission
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
