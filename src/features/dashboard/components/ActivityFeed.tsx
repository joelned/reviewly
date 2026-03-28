import { Clock3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'

interface ActivityItem {
  id: number
  label: string
  description: string
  created_at: string
  submissionId?: number
  submissionTitle?: string
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent movement across your review flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex w-10 flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-mutedSurface">
                <Clock3 className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 h-full w-px bg-border" />
            </div>
            <div className="space-y-1 pb-5">
              <p className="text-sm font-medium text-zinc-100">{item.label}</p>
              <p className="text-sm text-zinc-400">{item.description}</p>
              <p className="font-mono text-xs text-zinc-500">{formatRelativeTime(item.created_at)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

