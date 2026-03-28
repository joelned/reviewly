import { BarChart3, FileCode2, LayoutDashboard, PanelLeftClose, PanelLeftOpen, ShieldCheck, Sparkles, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type UserRole } from '@/types'

interface SidebarProps {
  role: UserRole
  collapsed: boolean
  onToggle: () => void
  mobile?: boolean
  onNavigate?: () => void
}

const navByRole: Record<UserRole, Array<{ to: string; label: string; icon: typeof LayoutDashboard }>> = {
  author: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/submissions', label: 'Submissions', icon: FileCode2 },
  ],
  reviewer: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reviews', label: 'Review Queue', icon: Sparkles },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: ShieldCheck },
    { to: '/admin/assignments', label: 'Assignments', icon: BarChart3 },
  ],
}

export function Sidebar({ role, collapsed, onToggle, mobile = false, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-surface/95 px-3 py-6 transition-all duration-200',
        mobile ? 'h-full w-[280px] max-w-[85vw]' : 'sticky top-0 hidden h-screen lg:flex',
        !mobile && (collapsed ? 'w-[60px]' : 'w-[240px]')
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className={cn('flex items-center gap-3 overflow-hidden', collapsed && 'justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 shadow-glow">
            <FileCode2 className="h-5 w-5 text-primary" />
          </div>
          {!collapsed ? (
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Reviewly</p>
              <p className="text-xs text-zinc-500">Async review ops</p>
            </div>
          ) : null}
        </div>
        {mobile ? (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onNavigate}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={onToggle}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navByRole[role].map((item) => (
          <NavLink
            key={item.to}
            onClick={onNavigate}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-zinc-400 transition-all duration-200 hover:bg-mutedSurface hover:text-zinc-100',
                isActive && 'bg-primary/12 text-primary',
                collapsed && !mobile && 'justify-center px-0'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed || mobile ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className={cn('mt-6 rounded-2xl border border-border bg-background/60 p-4', collapsed && !mobile && 'p-2')}>
        {!collapsed || mobile ? (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{role} mode</p>
            <p className="mt-2 text-sm text-zinc-300">Optimized workflows and permissions stay scoped to your lane.</p>
          </>
        ) : (
          <div className="flex justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
    </aside>
  )
}
