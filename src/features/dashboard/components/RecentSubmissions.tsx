import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { type Submission } from '@/types'

export function RecentSubmissions({ submissions }: { submissions: Submission[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest code review requests and status changes.</CardDescription>
        </div>
        <Button variant="secondary" asChild>
          <Link to="/submissions">Open all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            to={`/submissions/${submission.id}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/40 p-4 hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="space-y-1">
              <p className="font-medium text-zinc-100">{submission.title}</p>
              <p className="text-sm text-zinc-500">
                {submission.language} • {formatDate(submission.created_at)}
              </p>
            </div>
            <StatusBadge status={submission.status} />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

