import { Bell, ChevronRight, LogOut, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { useAuthStore } from '@/store/authStore'

function labelize(segment: string) {
  if (segment === 'admin') {
    return 'Admin'
  }
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function TopBar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
      <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500">
        <Button variant="secondary" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <Link to="/dashboard" className="hover:text-zinc-100">
          Reviewly
        </Link>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1

          return (
            <div className="hidden items-center gap-2 sm:flex" key={href}>
              <ChevronRight className="h-3.5 w-3.5" />
              {isLast ? (
                <span className="text-zinc-200">{labelize(segment)}</span>
              ) : (
                <Link to={href} className="hover:text-zinc-100">
                  {labelize(segment)}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" className="hidden sm:inline-flex" onClick={() => navigate('/dashboard')}>
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-2xl border border-border bg-mutedSurface/70 px-2.5 py-2 sm:gap-3 sm:px-3">
                <UserAvatar user={user} className="h-9 w-9" />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-zinc-100">{user.username}</p>
                  <p className="text-xs capitalize text-zinc-500">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Signed in as {user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>Go to dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  )
}
