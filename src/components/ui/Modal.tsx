import { useEffect, useId, useRef, type PropsWithChildren, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('aria-hidden'))
}

export function Modal({
  children,
  className,
  onClose,
  size = 'md',
  title,
}: PropsWithChildren<{
  className?: string
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: ReactNode
}>) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusable = getFocusableElements(dialog)
    ;(focusable[0] ?? dialog)?.focus()

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const candidates = getFocusableElements(dialog)
      if (candidates.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = candidates[0]
      const last = candidates[candidates.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog?.addEventListener('keydown', handleKeyDown)

    return () => {
      dialog?.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previousActive?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 p-4">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div className="relative flex h-full items-center justify-center">
        <div
          aria-labelledby={title ? titleId : undefined}
          aria-modal="true"
          className={cn(
            'radius-shell w-full bg-white shadow-2xl',
            size === 'sm' && 'max-w-sm',
            size === 'md' && 'max-w-md',
            size === 'lg' && 'max-w-lg',
            size === 'xl' && 'max-w-xl',
            className,
          )}
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
        >
        {title ? (
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="text-lg font-semibold text-slate-900" id={titleId}>
              {title}
            </div>
            <Button
              aria-label="Close dialog"
              className="text-slate-400 hover:text-slate-700"
              onClick={onClose}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
        <div className="p-6">{children}</div>
      </div>
      </div>
    </div>
  )
}
