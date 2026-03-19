import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function SectionHeader({
  action,
  eyebrow,
  description,
  title,
  className,
}: {
  action?: ReactNode
  className?: string
  description?: ReactNode
  eyebrow?: string
  title: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="max-readable text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
