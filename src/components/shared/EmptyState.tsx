import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-background/40">
      <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-2xl border border-border bg-mutedSurface p-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="max-w-md text-sm text-zinc-400">{description}</p>
        </div>
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  )
}

