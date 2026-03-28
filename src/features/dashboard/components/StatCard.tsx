import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: number | string
  helper: string
  trend?: string
  icon: LucideIcon
}

export function StatCard({ label, value, helper, trend, icon: Icon }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</p>
          <div className="space-y-1">
            <p className="text-3xl font-semibold text-foreground">{value}</p>
            <p className="text-sm text-zinc-400">{helper}</p>
          </div>
          {trend ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {trend}
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl border border-border bg-background/70 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
