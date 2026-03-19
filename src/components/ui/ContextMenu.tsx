import {
  type CSSProperties,
  useEffect,
  useMemo,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'

type ContextMenuItem = {
  disabled?: boolean
  label: string
  onSelect: () => void
}

export function ContextMenu({
  children,
  items,
}: {
  children: ReactNode
  items: ContextMenuItem[]
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items])
  const menuId = useId()
  const menuStyle = useMemo<CSSProperties>(
    () => ({
      left: position.x,
      position: 'fixed',
      top: position.y,
    }),
    [position.x, position.y],
  )

  useEffect(() => {
    if (!open) return

    const close = () => setOpen(false)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('click', close)
    window.addEventListener('contextmenu', close)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('contextmenu', close)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setActiveIndex(0)
    window.setTimeout(() => {
      itemRefs.current[0]?.focus()
    }, 0)
  }, [open])

  useEffect(() => {
    if (!open) return
    itemRefs.current[activeIndex]?.focus()
  }, [activeIndex, open])

  useEffect(() => {
    if (!open || !menuRef.current) return

    const rect = menuRef.current.getBoundingClientRect()
    const clampedX = Math.min(
      Math.max(8, position.x),
      Math.max(8, window.innerWidth - rect.width - 8),
    )
    const clampedY = Math.min(
      Math.max(8, position.y),
      Math.max(8, window.innerHeight - rect.height - 8),
    )

    if (clampedX !== position.x || clampedY !== position.y) {
      setPosition({ x: clampedX, y: clampedY })
    }
  }, [open, position.x, position.y])

  useEffect(() => {
    if (open) return
    triggerRef.current?.focus()
  }, [open])

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setPosition({ x: event.clientX, y: event.clientY })
    setOpen(true)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!enabledItems.length) return

    if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
      event.preventDefault()
      const rect = event.currentTarget.getBoundingClientRect()
      setPosition({ x: rect.left + 24, y: rect.top + 24 })
      setOpen(true)
      return
    }

    if (!open) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % enabledItems.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + enabledItems.length) % enabledItems.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(enabledItems.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      enabledItems[activeIndex]?.onSelect()
      setOpen(false)
    }
  }

  return (
    <div
      aria-controls={open ? menuId : undefined}
      aria-expanded={open || undefined}
      aria-haspopup="menu"
      className="relative"
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      ref={triggerRef}
    >
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-40"
          role="presentation"
        >
          <div
            className="min-w-[180px] rounded-xl border border-neutral-200 bg-white p-1 shadow-xl shadow-neutral-950/10"
            id={menuId}
            ref={menuRef}
            role="menu"
            style={menuStyle}
            tabIndex={-1}
          >
            {items.map((item) => {
              const index = enabledItems.findIndex((enabled) => enabled.label === item.label)
              const active = index === activeIndex && !item.disabled
              return (
                <button
                  aria-disabled={item.disabled || undefined}
                  className={cn(
                    'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-text-body',
                    item.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : active
                        ? 'bg-neutral-100 text-text-strong'
                        : 'hover:bg-neutral-50',
                  )}
                  disabled={item.disabled}
                  key={item.label}
                  ref={(node) => {
                    if (!item.disabled) {
                      itemRefs.current[index] = node
                    }
                  }}
                  onClick={() => {
                    item.onSelect()
                    setOpen(false)
                  }}
                  role="menuitem"
                  tabIndex={active ? 0 : -1}
                  type="button"
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
