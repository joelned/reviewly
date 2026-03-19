import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut, Settings, Shield, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../showcase'
import { cn } from '../../lib/cn'

const menuItems = [
  { icon: User, label: 'My Profile', path: '/reviewers/sarah-connor' },
  { icon: Settings, label: 'Profile Settings', path: '/settings/profile' },
  { icon: Shield, label: 'Organization Settings', path: '/settings/organization' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
]

export function AccountMenu({
  className,
  initials = 'EM',
}: {
  className?: string
  initials?: string
}) {
  const navigate = useNavigate()
  const auth = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className="touch-target inline-flex items-center justify-center rounded-full ring-offset-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Avatar className="h-10 w-10" initials={initials} />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-float"
          role="menu"
        >
          <div className="border-b border-neutral-100 px-3 py-3">
            <div className="text-sm font-semibold text-text-strong">
              {auth.user?.displayName ?? 'Reviewly user'}
            </div>
            <div className="mt-1 text-sm text-text-muted">
              @{auth.user?.username ?? 'signed-out'}
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text-body transition hover:bg-neutral-50 hover:text-text-strong"
                  onClick={() => {
                    setOpen(false)
                    navigate(item.path)
                  }}
                  role="menuitem"
                  type="button"
                >
                  <Icon className="h-4 w-4 text-neutral-400" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="border-t border-neutral-100 px-2 pt-2">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text-body transition hover:bg-neutral-50 hover:text-text-strong"
              onClick={() => {
                setOpen(false)
                auth.logout()
                navigate('/auth')
              }}
              role="menuitem"
              type="button"
            >
              <LogOut className="h-4 w-4 text-neutral-400" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
