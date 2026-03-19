import { useEffect, useId, useRef, type PropsWithChildren, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('aria-hidden'))
}

export function Sheet({
  children,
  className,
  onClose,
  title,
}: PropsWithChildren<{
  className?: string
  onClose?: () => void
  title?: ReactNode
}>) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const sheet = sheetRef.current
    const focusable = getFocusableElements(sheet)
    ;(focusable[0] ?? sheet)?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sheet) return
      if (event.key === 'Escape' && onClose) {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const candidates = getFocusableElements(sheet)
      if (candidates.length === 0) {
        event.preventDefault()
        sheet.focus()
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

    sheet?.addEventListener('keydown', handleKeyDown)

    return () => {
      sheet?.removeEventListener('keydown', handleKeyDown)
      previousActive?.focus()
    }
  }, [onClose])

  return (
    <div
      aria-labelledby={title ? titleId : undefined}
      aria-modal="true"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85svh] w-full rounded-t-[1.75rem] bg-white shadow-2xl animate-slide-up sm:max-w-lg',
        className,
      )}
      ref={sheetRef}
      role="dialog"
      tabIndex={-1}
    >
      <div className="flex justify-center pb-2 pt-3">
        <div className="h-1.5 w-10 rounded-full bg-gray-300" />
      </div>
      {title || onClose ? (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-4">
          <div className="text-lg font-semibold text-gray-900" id={titleId}>
            {title}
          </div>
          {onClose ? (
            <button
              aria-label="Close sheet"
              className="touch-target inline-flex items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
