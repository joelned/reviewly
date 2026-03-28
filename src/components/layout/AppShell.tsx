import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export function AppShell() {
  const user = useAuthStore((state) => state.user)
  const [collapsed, setCollapsed] = useLocalStorage('reviewly-sidebar-collapsed', false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={user.role} collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <Dialog open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <DialogContent className="left-0 top-0 h-screen w-auto max-w-none translate-x-0 translate-y-0 rounded-none border-r border-border p-0 sm:max-w-none [&>button]:hidden">
          <Sidebar
            role={user.role}
            collapsed={false}
            mobile
            onToggle={() => undefined}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="relative flex-1 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.06),transparent_25%)]" />
          <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
