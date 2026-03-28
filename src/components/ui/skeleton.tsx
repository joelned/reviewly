import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-[linear-gradient(90deg,rgba(38,38,38,0.9)_25%,rgba(59,59,59,0.9)_37%,rgba(38,38,38,0.9)_63%)] bg-[length:400%_100%]',
        className
      )}
      {...props}
    />
  )
}
