import { MessageSquareMore } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { InlineComment } from '@/features/reviews/components/InlineComment'
import { type ReviewComment } from '@/types'

interface ReviewThreadProps {
  comments: ReviewComment[]
  onSelectLine?: (lineNumber: number) => void
}

export function ReviewThread({ comments, onSelectLine }: ReviewThreadProps) {
  if (!comments.length) {
    return (
      <EmptyState
        icon={MessageSquareMore}
        title="No inline comments yet"
        description="When reviewers add line-level feedback, it will appear here as a threaded stream."
        actionLabel="Start reviewing"
        onAction={() => onSelectLine?.(1)}
      />
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <button key={comment.id} type="button" className="block w-full text-left" onClick={() => onSelectLine?.(comment.line_number)}>
          <InlineComment comment={comment} />
        </button>
      ))}
    </div>
  )
}

