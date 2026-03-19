import {
  Bell,
  Check,
  Clock3,
  FilePlus2,
  GitPullRequest,
  LayoutGrid,
  MessageSquare,
  Settings,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Avatar,
  DesktopViewport,
  PhoneViewport,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { AccountMenu } from '../components/ui/AccountMenu'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cn } from '../lib/cn'

type ActiveSubmission =
  | {
      loading: false
      changes: string
      reviewers: string[]
      status: string
      tags: string[]
      time: string
      title: string
    }
  | {
      loading: true
      title: string
    }

const submitterSubmissions: ActiveSubmission[] = [
  {
    changes: '+142 / -12',
    loading: false,
    reviewers: ['SC', 'MK', 'TR'],
    status: 'In Review',
    tags: ['TypeScript', 'Security'],
    time: '#452 • 2h ago',
    title: 'Refactor Auth Provider',
  },
  {
    loading: true,
    title: 'Loading card',
  },
]

const reviewerAssignments: ActiveSubmission[] = [
  {
    changes: '+78 / -14',
    loading: false,
    reviewers: ['SC', 'JR'],
    status: 'Assigned',
    tags: ['React', 'Hooks'],
    time: '#402 • due today',
    title: 'State Machine Refactor',
  },
  {
    changes: '+33 / -8',
    loading: false,
    reviewers: ['SC', 'AK'],
    status: 'Pending Review',
    tags: ['TypeScript', 'DX'],
    time: '#411 • 45m ago',
    title: 'Binary Search Improvements',
  },
]

const activity = [
  {
    icon: Check,
    tone: 'text-success-600',
    message: 'Review submitted for PR #42',
    time: '15 mins ago',
  },
  {
    icon: GitPullRequest,
    tone: 'text-brand',
    message: "You were assigned to 'API Optimization'",
    time: '2 hours ago',
  },
  {
    icon: Clock3,
    tone: 'text-warning-500',
    message: 'Submission delayed by linting errors',
    time: 'Yesterday, 4:20 PM',
  },
]

const desktopQueue = [
  {
    detail: 'Reply to the auth middleware thread before noon to unblock release prep.',
    label: 'Reviews awaiting feedback',
    value: '3',
  },
  {
    detail: 'Two completed reports are ready to send to teammates and stakeholders.',
    label: 'Reports ready to share',
    value: '2',
  },
  {
    detail: 'There are new team mentions and assignment changes waiting in your inbox.',
    label: 'Team mentions',
    value: '4',
  },
]

const reviewerQueue = [
  {
    detail: 'State Machine Refactor is waiting on your first pass before the team can merge.',
    label: 'Assigned now',
    value: '3',
  },
  {
    detail: 'One review has an unresolved thread that still needs your response.',
    label: 'Need follow-up',
    value: '1',
  },
  {
    detail: 'Two finished reviews are ready for final report handoff.',
    label: 'Ready to close',
    value: '2',
  },
]

const mobileNavItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: GitPullRequest, label: 'Submissions', path: '/submissions/402' },
  { icon: MessageSquare, label: 'Reviews', path: '/reviews/402' },
  { icon: TrendingUp, label: 'Reports', path: '/reports/402' },
  { icon: Settings, label: 'Settings', path: '/settings/organization' },
]

function ActiveSubmissionList({
  items,
  isSubmitter,
  navigate,
}: {
  items: ActiveSubmission[]
  isSubmitter: boolean
  navigate: ReturnType<typeof useNavigate>
}) {
  if (items.length === 0) {
    return (
      <Card className="space-y-4 text-center" surface="subtle">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-text-body">
          <GitPullRequest className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-text-strong">
            {isSubmitter ? 'No submissions yet' : 'No reviews assigned'}
          </h3>
          <p className="text-sm leading-6 text-text-body">
            {isSubmitter
              ? 'Start a new submission to send your next change out for async review.'
              : 'New review assignments will show up here as soon as they land in your queue.'}
          </p>
        </div>
        <Button
          onClick={() => navigate(isSubmitter ? '/submissions/new' : '/notifications')}
          type="button"
          variant="primary"
        >
          {isSubmitter ? 'New Submission' : 'Open Notifications'}
        </Button>
      </Card>
    )
  }

  return (
    <>
      {items.map((submission, index) =>
        submission.loading ? (
          <Card key={index} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-36 animate-shimmer rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
                <div className="h-3 w-20 animate-shimmer rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
              </div>
              <div className="h-6 w-16 animate-shimmer rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
            </div>
            <div className="flex items-center gap-2 border-t border-neutral-100 pt-2">
              <div className="h-7 w-20 animate-shimmer rounded-full bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
              <div className="flex-1" />
              <div className="h-8 w-16 animate-shimmer rounded-lg bg-[length:200%_100%] bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
            </div>
          </Card>
        ) : (
          <Card key={submission.title} interactive>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold leading-tight text-text-strong">
                  {submission.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-text-muted">{submission.time}</p>
              </div>
              <Badge variant="brand">{submission.status}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {submission.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs text-text-body"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
              <div className="flex -space-x-2">
                {submission.reviewers.map((reviewer) => (
                  <Avatar
                    key={reviewer}
                    className="h-7 w-7 border-2 border-white text-xs"
                    initials={reviewer}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-text-muted">
                  {submission.changes}
                </span>
                <Button
                  onClick={() => navigate('/submissions/402')}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        ),
      )}
    </>
  )
}

function ActivityTimeline() {
  return (
    <div className="space-y-4">
      {activity.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.message} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Icon className={`h-3.5 w-3.5 ${item.tone}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-strong">{item.message}</p>
              <p className="mt-0.5 text-xs text-text-muted">{item.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MobileDashboard({
  displayName,
  isSubmitter,
  navigate,
  reputation,
  submissions,
}: {
  displayName: string
  isSubmitter: boolean
  navigate: ReturnType<typeof useNavigate>
  reputation: number
  submissions: ActiveSubmission[]
}) {
  const quotaPercent = 68
  const quotaBarColor =
    quotaPercent >= 80 ? 'bg-danger' : quotaPercent >= 60 ? 'bg-warning-500' : 'bg-brand'

  return (
    <PhoneViewport className="surface-page">
      <header className="safe-top sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-md shadow-brand/20">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Reviewly</span>
        </div>
        <Button
          aria-label="Open notifications"
          className="relative text-text-body"
          onClick={() => navigate('/notifications')}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger-500" />
        </Button>
      </header>

      <main className="space-y-6 p-4 pb-32 sm:p-5 sm:pb-36">
        <section className="space-y-4">
          <Card className="hero-brand-gradient text-white shadow-lg shadow-neutral-300/30">
            <div className="space-y-5">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Good morning, {displayName}
                </h1>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-300">
                  {isSubmitter
                    ? 'You have 3 code reviews pending today.'
                    : 'You have 3 review assignments waiting.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {isSubmitter ? (
                  <Button
                    className="bg-white text-text-strong hover:bg-neutral-100 hover:text-text-strong"
                    leadingIcon={<FilePlus2 className="h-5 w-5" />}
                    onClick={() => navigate('/submissions/new')}
                    size="lg"
                    type="button"
                    variant="secondary"
                  >
                    New Submission
                  </Button>
                ) : (
                  <Button
                    className="bg-white text-text-strong hover:bg-neutral-100 hover:text-text-strong"
                    onClick={() => navigate('/reviews/402')}
                    size="lg"
                    type="button"
                    variant="secondary"
                  >
                    Open Review Queue
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {(isSubmitter
            ? [
                ['Total Submissions', '128', '+12%'],
                ['Reviews Completed', '42', null],
                ['Avg Score', '7.8', '/10'],
                ['Quota Used', '34/50', '68%'],
              ]
            : [
                ['Reviews Completed', '42', null],
                ['Avg Score Given', '8.1', '/10'],
                ['Pending Assignments', '3', null],
                ['Reputation', `${reputation}`, null],
              ]
          ).map(([label, value, meta]) => (
            <Card key={label}>
              <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
              {label === 'Quota Used' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-text-body">{value}</span>
                    <span className="text-neutral-400">{meta}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div className={cn('h-full w-[68%]', quotaBarColor)} />
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-between">
                  <span className="font-mono text-2xl font-bold">
                    {value}
                    {meta === '/10' ? (
                      <span className="ml-1 font-sans text-sm text-neutral-400">{meta}</span>
                    ) : null}
                  </span>
                  {meta === '+12%' ? <Badge variant="success">{meta}</Badge> : null}
                </div>
              )}
            </Card>
          ))}
        </section>

        <section className="space-y-3">
          <SectionHeader
            action={
              <Button
                className="px-0 text-brand hover:bg-transparent"
                onClick={() => navigate('/submissions/402')}
                variant="ghost"
              >
                View all
              </Button>
            }
            title={isSubmitter ? 'Active Submissions' : 'Assigned Reviews'}
          />
          <ActiveSubmissionList isSubmitter={isSubmitter} items={submissions} navigate={navigate} />
        </section>

        <section className="space-y-4 pb-4">
          <SectionHeader title="Recent Activity" />
          <ActivityTimeline />
        </section>
      </main>

      <nav className="bottom-nav-shadow safe-bottom-lg fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md items-center justify-between border-t border-neutral-200 bg-white/90 px-4 py-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:max-w-lg sm:px-6 lg:max-w-xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const active = item.path === '/dashboard'
          return (
            <button
              key={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'touch-target flex flex-col items-center gap-1',
                active ? 'text-brand' : 'text-neutral-400',
              )}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </PhoneViewport>
  )
}

function DesktopDashboard({
  displayName,
  initials,
  isSubmitter,
  navigate,
  reputation,
  submissions,
}: {
  displayName: string
  initials: string
  isSubmitter: boolean
  navigate: ReturnType<typeof useNavigate>
  reputation: number
  submissions: ActiveSubmission[]
}) {
  return (
    <DesktopViewport className="surface-page">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <WorkspaceShell wide className="flex min-h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-text-strong">Reviewly</div>
              <div className="text-sm text-text-muted">Developer review workspace</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSubmitter ? (
              <Button
                leadingIcon={<FilePlus2 className="h-4 w-4" />}
                onClick={() => navigate('/submissions/new')}
                shortcutHint="N"
                type="button"
                variant="primary"
              >
                New Submission
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/reviews/402')}
                type="button"
                variant="primary"
              >
                Open Review Queue
              </Button>
            )}
            <Button
              aria-label="Open notifications"
              className="relative text-text-body"
              onClick={() => navigate('/notifications')}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger-500" />
            </Button>
            <AccountMenu initials={initials} />
          </div>
        </WorkspaceShell>
      </header>

      <WorkspaceShell wide className="px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,380px)]">
          <div className="space-y-8">
            <Card className="hero-brand-gradient overflow-hidden text-white shadow-lg shadow-neutral-300/40">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Good morning, {displayName}
                </h1>
                <p className="mt-3 max-w-[34rem] text-base leading-7 text-neutral-300">
                  {isSubmitter
                    ? 'You have 3 code reviews pending today.'
                    : 'You have 3 review assignments waiting.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {isSubmitter ? (
                    <Button
                      className="bg-white text-text-strong hover:bg-neutral-100 hover:text-text-strong"
                      leadingIcon={<FilePlus2 className="h-5 w-5" />}
                      onClick={() => navigate('/submissions/new')}
                      size="lg"
                      type="button"
                      variant="secondary"
                    >
                      New Submission
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-white text-text-strong hover:bg-neutral-100 hover:text-text-strong"
                        onClick={() => navigate('/reviews/402')}
                        size="lg"
                        type="button"
                        variant="secondary"
                      >
                        Open Review Queue
                      </Button>
                      <Button
                        className="px-0 text-white hover:bg-transparent hover:text-neutral-200"
                        onClick={() => navigate('/submissions/402')}
                        type="button"
                        variant="ghost"
                      >
                        Browse open submissions
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <section className="space-y-4">
              <SectionHeader title={isSubmitter ? 'Overview' : 'Reviewer performance'} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {(isSubmitter
                  ? [
                      ['Total Submissions', '128', '+12%'],
                      ['Reviews Completed', '42', 'This month'],
                      ['Avg Score', '7.8 / 10', 'Across recent submissions'],
                      ['Quota Used', '34/50', '68% this cycle'],
                    ]
                  : [
                      ['Reviews Completed', '42', 'This month'],
                      ['Avg Score Given', '8.1 / 10', 'Across recent reviews'],
                      ['Pending Assignments', '3', 'Waiting now'],
                      ['Reputation', `${reputation}`, 'Trust signal'],
                    ]
                ).map(([label, value, meta]) => (
                  <Card elevated key={label} surface="subtle">
                    <div className="text-sm font-medium text-text-muted">{label}</div>
                    <div className="mt-4 text-3xl font-bold tracking-tight text-text-strong">
                      {value}
                    </div>
                    <div className="mt-3 text-sm text-text-muted">{meta}</div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeader
                action={
                  <Button
                    onClick={() => navigate('/submissions/402')}
                    type="button"
                    variant="ghost"
                  >
                    {isSubmitter ? 'View all' : 'Open queue'}
                  </Button>
                }
                title={isSubmitter ? 'Active submissions' : 'Assigned reviews'}
              />
              <div className="grid gap-4 xl:grid-cols-2">
                <ActiveSubmissionList isSubmitter={isSubmitter} items={submissions} navigate={navigate} />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card elevated className="space-y-4">
              <SectionHeader title={isSubmitter ? 'Needs attention' : 'Review queue'} />
              <div className="space-y-3">
                {(isSubmitter ? desktopQueue : reviewerQueue).map((item) => (
                  <div
                    key={item.label}
                    className="surface-subtle rounded-2xl border border-neutral-200 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-text-body">{item.label}</div>
                        <p className="mt-1 text-sm leading-6 text-text-muted">{item.detail}</p>
                      </div>
                      <Badge variant="brand">{item.value}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                block
                onClick={() => navigate(isSubmitter ? '/reviews/402' : '/submissions/402')}
                type="button"
                variant="secondary"
              >
                {isSubmitter ? 'Open review queue' : 'Browse open submissions'}
              </Button>
            </Card>

            <Card elevated className="space-y-4">
              <SectionHeader
                action={
                  <Button onClick={() => navigate('/notifications')} type="button" variant="ghost">
                    Open inbox
                  </Button>
                }
                title="Recent activity"
              />
              <ActivityTimeline />
            </Card>
          </div>
        </div>
      </WorkspaceShell>
    </DesktopViewport>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, isReviewer, isSubmitter } = useAuth()
  const displayName = user?.displayName ?? 'there'
  const reputation = user?.reputation ?? 0
  const initials =
    user?.displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? 'EM'
  const submissions = isReviewer ? reviewerAssignments : submitterSubmissions

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent">
        <div className="lg:hidden">
          <MobileDashboard
            displayName={displayName}
            isSubmitter={isSubmitter}
            navigate={navigate}
            reputation={reputation}
            submissions={submissions}
          />
        </div>
        <div className="hidden lg:block">
          <DesktopDashboard
            displayName={displayName}
            initials={initials}
            isSubmitter={isSubmitter}
            navigate={navigate}
            reputation={reputation}
            submissions={submissions}
          />
        </div>
      </ScreenCanvas>
    </div>
  )
}
