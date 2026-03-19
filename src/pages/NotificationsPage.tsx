import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  MessageSquare,
  RefreshCw,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DesktopViewport,
  PhoneViewport,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Sheet } from '../components/ui/Sheet'
import { cn } from '../lib/cn'

type NotificationItem = {
  accent?: string
  message: string
  read: boolean
  time: string
  tone: string
  type: 'comment' | 'status' | 'report' | 'assignment' | 'alert' | 'system'
}

type NotificationFilter = 'all' | 'unread' | 'mentions'

const typeLabelMap: Record<NotificationItem['type'], string> = {
  alert: 'Alert',
  assignment: 'Assignment',
  comment: 'Mention',
  report: 'Report',
  status: 'Status',
  system: 'System',
}

const baseNotifications: NotificationItem[] = [
  {
    message: 'Jordan left an inline comment on Binary Search Implementation',
    read: false,
    time: '2m ago',
    tone: 'bg-indigo-100 text-indigo-600',
    type: 'comment',
  },
  {
    message: 'Your submission React Hook Patterns is now IN_REVIEW',
    read: false,
    time: '15m ago',
    tone: 'bg-green-100 text-green-600',
    type: 'status',
  },
  {
    message: 'Review report is ready for Debounce Utility',
    read: false,
    time: '1h ago',
    tone: 'bg-indigo-100 text-indigo-600',
    type: 'report',
  },
  {
    message: 'You were assigned to review State Machine Refactor',
    read: false,
    time: '3h ago',
    tone: 'bg-indigo-100 text-indigo-600',
    type: 'assignment',
  },
  {
    message: 'An inline comment anchor was modified in Quick Sort Algorithm',
    read: true,
    time: '5h ago',
    tone: 'bg-yellow-100 text-yellow-600',
    type: 'alert',
  },
  {
    message: 'Kofi submitted their review on Binary Search Implementation',
    read: true,
    time: 'Yesterday',
    tone: 'bg-green-100 text-green-600',
    type: 'status',
  },
]

const iconMap = {
  alert: AlertCircle,
  assignment: UserPlus,
  comment: MessageSquare,
  report: FileCheck2,
  status: CheckCircle2,
  system: Sparkles,
}

function getTimeGroup(time: string) {
  if (time.includes('Just now') || time.includes('m ago')) return 'Now'
  if (time.includes('h ago')) return 'Today'
  return 'Yesterday'
}

function NotificationList({
  filter,
  filteredNotifications,
  latestKey,
  onOpenNotification,
}: {
  filter: NotificationFilter
  filteredNotifications: NotificationItem[]
  latestKey: string | null
  onOpenNotification: (notification: NotificationItem) => void
}) {
  const groupedNotifications = filteredNotifications.reduce<Record<string, NotificationItem[]>>(
    (groups, notification) => {
      const group = getTimeGroup(notification.time)
      groups[group] ??= []
      groups[group].push(notification)
      return groups
    },
    {},
  )
  const orderedGroups = ['Now', 'Today', 'Yesterday'].filter(
    (group) => groupedNotifications[group]?.length,
  )

  return (
    <div
      className="flex-1 overflow-y-auto"
      id={`notifications-panel-${filter}`}
      role="tabpanel"
    >
      {filteredNotifications.length === 0 ? (
        <div className="px-4 py-10 text-center sm:px-5 lg:px-6">
          <div className="text-sm font-semibold text-slate-900">No notifications here yet</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Try another filter or check again in a moment.
          </p>
        </div>
      ) : null}

      {orderedGroups.map((group) => (
        <section key={group} aria-label={group}>
          <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5 lg:px-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {group}
            </div>
          </div>
          {groupedNotifications[group].map((notification) => {
            const Icon = iconMap[notification.type]
            const notificationKey = `${notification.message}-${notification.time}`
            return (
              <article
                aria-label={`${notification.message}. ${notification.time}.${notification.read ? '' : ' Unread.'}`}
                key={notificationKey}
                className={cn(
                  'flex cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-4 transition last:border-b-0 hover:bg-gray-50 sm:px-5 lg:px-6',
                  !notification.read &&
                    'border-l-4 border-l-reviewly-indigo bg-indigo-50/50 pl-3',
                  latestKey === notificationKey && 'animate-slide-down',
                )}
                onClick={() => onOpenNotification(notification)}
              >
                <div className="relative shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${notification.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {!notification.read && (
                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-reviewly-indigo" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className="rounded-md px-2.5 py-1 text-xs font-semibold"
                      variant={!notification.read ? 'brand' : 'neutral'}
                    >
                      {typeLabelMap[notification.type]}
                    </Badge>
                    {!notification.read ? (
                      <Badge className="rounded-md px-2.5 py-1 text-xs font-semibold" variant="info">
                        Unread
                      </Badge>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-sm leading-6 text-gray-900',
                      !notification.read && 'font-semibold',
                    )}
                  >
                    {notification.message}
                  </p>
                  <span className="mt-1 block text-sm text-gray-500">{notification.time}</span>
                </div>
              </article>
            )
          })}
        </section>
      ))}
    </div>
  )
}

function NotificationFilters({
  filter,
  setFilter,
}: {
  filter: NotificationFilter
  setFilter: (value: NotificationFilter) => void
}) {
  return (
    <nav
      aria-label="Notification filters"
      className="flex border-b border-gray-100 px-4 sm:px-5 lg:px-6"
      role="tablist"
    >
      {[
        ['All', 'all'],
        ['Unread', 'unread'],
        ['Mentions', 'mentions'],
      ].map(([label, value]) => (
        <button
          aria-controls={`notifications-panel-${value}`}
          aria-selected={filter === value}
          key={value}
          className={cn(
            'px-4 py-3 text-sm font-medium transition',
            filter === value
              ? 'border-b-2 border-reviewly-indigo text-gray-900'
              : 'text-gray-500 hover:text-gray-700',
          )}
          onClick={() => setFilter(value as 'all' | 'unread' | 'mentions')}
          role="tab"
          type="button"
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationItem[]>(baseNotifications)
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [checking, setChecking] = useState(false)
  const [latestKey, setLatestKey] = useState<string | null>(null)
  const [undoSnapshot, setUndoSnapshot] = useState<NotificationItem[] | null>(null)
  const [undoVisible, setUndoVisible] = useState(false)

  const unread = notifications.filter((item) => !item.read).length
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read
    if (filter === 'mentions') return notification.type === 'comment'
    return true
  })
  const mentionCount = notifications.filter((item) => item.type === 'comment' && !item.read).length
  const assignmentCount = notifications.filter(
    (item) => item.type === 'assignment' && !item.read,
  ).length
  const reportCount = notifications.filter((item) => item.type === 'report' && !item.read).length

  const openNotification = (notification: NotificationItem) => {
    if (notification.type === 'report') {
      navigate('/reports/402')
      return
    }

    if (notification.type === 'assignment' || notification.type === 'comment') {
      navigate('/reviews/402')
      return
    }

    navigate('/submissions/402')
  }
  const liveMessage = checking
    ? 'Checking for new notifications.'
    : undoVisible
      ? 'All notifications marked read. Undo is available.'
    : latestKey
      ? 'A new notification has been added.'
      : `${unread} unread notifications.`

  const checkForNotifications = () => {
    setChecking(true)
    window.requestAnimationFrame(() => {
      const next = {
        message: 'Jordan mentioned you in the auth middleware review',
        read: false,
        time: 'Just now',
        tone: 'bg-indigo-100 text-indigo-600',
        type: 'comment' as const,
      }
      setLatestKey(`${next.message}-${next.time}`)
      setNotifications((current) => [next, ...current])
      setChecking(false)
    })
  }

  const markAllRead = () => {
    setUndoSnapshot(notifications)
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      })),
    )
    setUndoVisible(true)
    window.setTimeout(() => setUndoVisible(false), 5000)
  }

  const undoMarkAllRead = () => {
    if (!undoSnapshot) return
    setNotifications(undoSnapshot)
    setUndoSnapshot(null)
    setUndoVisible(false)
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent">
        <div className="lg:hidden">
          <PhoneViewport className="relative min-h-[70svh] bg-transparent sm:min-h-[640px]">
            <button
              aria-label="Close notifications"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => navigate('/dashboard')}
              type="button"
            />
            <Sheet onClose={() => navigate('/dashboard')} title="Notifications">
              <header className="flex flex-col gap-3 border-b border-gray-100 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-2">
                  <Badge aria-label={`${unread} unread notifications`} variant="brand">
                    {unread} unread
                  </Badge>
                  {mentionCount > 0 ? <Badge variant="info">{mentionCount} mentions</Badge> : null}
                </div>
                <Button
                  className="px-0 text-reviewly-indigo hover:bg-transparent"
                  disabled={unread === 0}
                  onClick={markAllRead}
                  type="button"
                  variant="ghost"
                >
                  Mark all read
                </Button>
              </header>

              <div className="border-b border-gray-100 bg-slate-50 px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Stay on top of review activity
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Comments, reports, assignments, and team status changes appear here
                      as they happen.
                    </p>
                  </div>
                  <Badge variant="neutral">Live</Badge>
                </div>
              </div>

              <NotificationFilters filter={filter} setFilter={setFilter} />

              <div aria-live="polite" className="sr-only" role="status">
                {liveMessage}
              </div>

              {undoVisible ? (
                <div className="border-b border-blue-100 bg-blue-50 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-blue-900">
                      All notifications marked read.
                    </p>
                    <Button onClick={undoMarkAllRead} type="button" variant="ghost">
                      Undo
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="max-h-[58svh] flex-1 overflow-y-auto sm:max-h-[62vh]">
                <NotificationList
                  filter={filter}
                  filteredNotifications={filteredNotifications}
                  latestKey={latestKey}
                  onOpenNotification={openNotification}
                />
              </div>

              <div className="safe-bottom-lg border-t border-gray-100 bg-gray-50/60 px-4 py-4 sm:px-5">
                <Button
                  block
                  leadingIcon={<RefreshCw className="h-4 w-4" />}
                  loading={checking}
                  onClick={checkForNotifications}
                  type="button"
                  variant="outline"
                >
                  Check for new notifications
                </Button>
              </div>
            </Sheet>
          </PhoneViewport>
        </div>

        <div className="hidden lg:block">
          <DesktopViewport className="bg-slate-50">
            <WorkspaceShell wide className="px-6 py-8">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_360px]">
                <section className="radius-shell overflow-hidden border border-slate-200 bg-white shadow-soft">
                  <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Notifications
                      </h1>
                      <p className="mt-2 max-w-[38rem] text-sm leading-6 text-slate-500">
                        A desktop inbox for review activity, team mentions, assignments,
                        and report updates.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge aria-label={`${unread} unread notifications`} variant="brand">
                        {unread} unread
                      </Badge>
                      {mentionCount > 0 ? <Badge variant="info">{mentionCount} mentions</Badge> : null}
                      <Button onClick={() => navigate('/dashboard')} type="button" variant="ghost">
                        Back to dashboard
                      </Button>
                    </div>
                  </header>

                  <div className="border-b border-gray-100 bg-slate-50 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Stay on top of review activity
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Critical actions are kept in view while the rest of the stream
                          stays easy to scan on wider screens.
                        </p>
                      </div>
                      <Button
                        disabled={unread === 0}
                        onClick={markAllRead}
                        type="button"
                        variant="outline"
                      >
                        Mark all read
                      </Button>
                    </div>
                  </div>

                  <NotificationFilters filter={filter} setFilter={setFilter} />

                  <div aria-live="polite" className="sr-only" role="status">
                    {liveMessage}
                  </div>

                  {undoVisible ? (
                    <div className="border-b border-blue-100 bg-blue-50 px-6 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-blue-900">
                          All notifications marked read.
                        </p>
                        <Button onClick={undoMarkAllRead} type="button" variant="ghost">
                          Undo
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <NotificationList
                    filter={filter}
                    filteredNotifications={filteredNotifications}
                    latestKey={latestKey}
                    onOpenNotification={openNotification}
                  />
                </section>

                <aside className="space-y-6">
                  <div className="radius-shell border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Activity summary
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Mentions and assignments should pull attention first. Reports can wait
                          until active work is clear.
                        </p>
                      </div>
                      <Badge variant="neutral">Live</Badge>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        ['Mentions', mentionCount],
                        ['Assignments', assignmentCount],
                        ['Reports', reportCount],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <Badge variant="brand">{value}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="radius-shell border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="text-sm font-semibold text-slate-900">
                      Quick actions
                    </div>
                    <div className="mt-4 space-y-3">
                      <Button
                        block
                        leadingIcon={<RefreshCw className="h-4 w-4" />}
                        loading={checking}
                        onClick={checkForNotifications}
                        type="button"
                        variant="outline"
                      >
                        Check for new notifications
                      </Button>
                      <Button
                        block
                        onClick={() => navigate('/reviews/402')}
                        type="button"
                        variant="primary"
                      >
                        Open active review
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </WorkspaceShell>
          </DesktopViewport>
        </div>
      </ScreenCanvas>
    </div>
  )
}
