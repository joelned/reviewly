import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { type Submission } from '@/types'

export function SubmissionCard({ submission }: { submission: Submission }) {
  return (
    <Link to={`/submissions/${submission.id}`}>
      <Card className="hover:border-primary/30 hover:bg-primary/5">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-zinc-100">{submission.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{submission.description}</p>
            </div>
            <StatusBadge status={submission.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span>{submission.language}</span>
            <span>Urgency: {submission.urgency ?? 'normal'}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatRelativeTime(submission.created_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

