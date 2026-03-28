import { MessageSquareQuote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { type ReviewComment } from '@/types'

export function InlineComment({ comment }: { comment: ReviewComment }) {
  return (
    <Card className="border-primary/15 bg-primary/5">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-100">
            <MessageSquareQuote className="h-4 w-4 text-primary" />
            Line {comment.line_number}
          </div>
          <span className="font-mono text-xs text-zinc-500">{formatRelativeTime(comment.created_at)}</span>
        </div>
        <p className="text-sm text-zinc-300">{comment.content}</p>
        <p className="text-xs text-zinc-500">By {comment.author.username}</p>
      </CardContent>
    </Card>
  )
}

