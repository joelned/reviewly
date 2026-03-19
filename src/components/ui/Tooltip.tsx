import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'

export function Tooltip({
  children,
  className,
  content,
  side = 'top',
}: {
  children: ReactElement
  className?: string
  content: ReactNode
  side?: 'top' | 'bottom'
}) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  if (!content) return children
  if (!isValidElement(children)) return children

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': visible ? tooltipId : undefined,
    onBlur: (event: FocusEvent<HTMLElement>) => {
      setVisible(false)
      const original = children.props as { onBlur?: (event: FocusEvent<HTMLElement>) => void }
      original.onBlur?.(event)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      setVisible(true)
      const original = children.props as { onFocus?: (event: FocusEvent<HTMLElement>) => void }
      original.onFocus?.(event)
    },
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      setVisible(true)
      const original = children.props as { onMouseEnter?: (event: MouseEvent<HTMLElement>) => void }
      original.onMouseEnter?.(event)
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      setVisible(false)
      const original = children.props as { onMouseLeave?: (event: MouseEvent<HTMLElement>) => void }
      original.onMouseLeave?.(event)
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        setVisible(false)
      }
      const original = children.props as { onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void }
      original.onKeyDown?.(event)
    },
  })

  return (
    <span className={cn('relative inline-flex', className)}>
      {trigger}
      <span
        aria-hidden={!visible}
        className={cn(
          'pointer-events-none absolute left-1/2 z-40 hidden max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-950 px-2.5 py-1.5 text-center text-xs font-medium leading-5 text-white shadow-lg transition md:block',
          side === 'top' ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]',
          visible ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        id={tooltipId}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  )
}
