import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Toast({
  className,
  icon,
  message,
  visible,
}: {
  className?: string
  icon?: ReactNode
  message: ReactNode
  visible: boolean
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'safe-bottom pointer-events-none fixed bottom-4 left-1/2 z-30 flex w-[min(calc(100vw-1rem),32rem)] -translate-x-1/2 items-start gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl transition',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0',
        className,
      )}
      role="status"
    >
      {icon ?? <CheckCircle2 className="h-4 w-4 text-green-400" />}
      <span className="min-w-0 leading-6">{message}</span>
    </div>
  )
}
