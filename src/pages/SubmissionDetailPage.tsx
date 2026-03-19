import { useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileCode2,
  GitPullRequest,
  MessageCircle,
  Plus,
  Settings,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  DesktopViewport,
  PhoneViewport,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ContextMenu } from '../components/ui/ContextMenu'
import { Textarea } from '../components/ui/Field'
import { Toast } from '../components/ui/Toast'
import { Tooltip } from '../components/ui/Tooltip'
import { cn } from '../lib/cn'

const desktopCodeLines = [
  "import { useRef, useEffect, useCallback } from 'react';",
  '',
  '/**',
  ' * A hook to debounce a callback function',
  ' */',
  'export function useDebounce<T extends (...args: any[]) => any>(',
  '  callback: T,',
  '  delay: number',
  '): T {',
  '  const timeoutRef = useRef<NodeJS.Timeout>();',
  '',
  '  useEffect(() => {',
]

const desktopTailLines = [
  '  callback: T,',
  '  delay: number',
  '): T {',
  '  const timeoutRef = useRef<NodeJS.Timeout>();',
  '',
  '  useEffect(() => {',
  '    // Implementation continues...',
]

const mobileCodeLines = [
  "import { NextRequest } from 'next/server';",
  "import { verifyToken } from '@/lib/auth';",
  '',
  'export async function middleware(req: NextRequest) {',
  "  const token = req.cookies.get('session');",
  '  if (!token) {',
  "    return Response.json({ error: 'Unauthorized' }, { status: 401 });",
  '  }',
  '}',
]

const mobileComments = [
  {
    author: 'Jane Doe',
    body: 'Should we check for token expiration here explicitly, or does verifyToken handle that?',
    status: 'unresolved' as const,
    time: '2h ago',
  },
  {
    author: 'alex_dev',
    body: 'Resolved after the helper comment was added and the token path was clarified.',
    status: 'resolved' as const,
    time: '1h ago',
  },
]

const unresolvedWorkItems = [
  'Reply to the orphaned comment in the debounce hook thread.',
  'Address the requested change around the generic return type.',
]

const mobileDetailNavItems = [
  { icon: Code2, label: 'Files', path: '/submissions/402' },
  { icon: MessageCircle, label: 'Discussions', path: '/reviews/402' },
  { icon: GitPullRequest, label: 'PR Info', path: '/submissions/402' },
  { icon: Settings, label: 'Settings', path: '/settings/organization' },
]

export function SubmissionDetailPage() {
  const navigate = useNavigate()
  const [selectedDesktopLine, setSelectedDesktopLine] = useState<number>(6)
  const [actionToast, setActionToast] = useState<string | null>(null)
  const [mobileCommentFilter, setMobileCommentFilter] = useState<'unresolved' | 'all'>(
    'unresolved',
  )
  const desktopLineRefs = useRef<Array<HTMLDivElement | null>>([])

  const showActionToast = (message: string) => {
    setActionToast(message)
    window.setTimeout(() => setActionToast(null), 2200)
  }

  const copyToClipboard = async (value: string, successMessage: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value)
      }
      showActionToast(successMessage)
    } catch {
      showActionToast(successMessage)
    }
  }

  const focusDesktopLine = (lineNumber: number) => {
    desktopLineRefs.current[lineNumber - 1]?.focus()
    setSelectedDesktopLine(lineNumber)
  }

  const visibleMobileComments =
    mobileCommentFilter === 'all'
      ? mobileComments
      : mobileComments.filter((comment) => comment.status === 'unresolved')

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0">
        <div className="lg:hidden">
          <PhoneViewport className="surface-page">
            <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <Button
                    aria-label="Go back"
                    className="text-text-body"
                    onClick={() => navigate('/dashboard')}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <ChevronLeft className="h-6 w-6 text-text-body" />
                  </Button>
                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold leading-tight">
                      PR #402: Auth Middleware
                    </h1>
                    <span className="font-mono text-xs text-text-muted">
                      SUBMITTED BY @JSMITH
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex items-center gap-2">
                  <Badge variant="warning">Reviewing</Badge>
                </div>
              </div>
            </header>

            <main className="surface-page min-h-[70svh] pb-28 sm:min-h-[60svh] sm:pb-32">
              <section className="surface-dark overflow-x-auto px-4 pb-8 pt-4 text-neutral-300">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <FileCode2 className="h-4 w-4 text-secondary-400" />
                    auth/middleware.ts
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Compact preview
                  </span>
                </div>
                <div className="space-y-1 font-mono text-sm leading-relaxed">
                  {mobileCodeLines.map((line, index) => (
                    <div
                      key={`${index + 1}-${line}`}
                      className={cn(
                        'grid grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-center gap-2',
                        index === 3 ? 'bg-secondary-500/10' : 'hover:bg-white/10',
                      )}
                    >
                      <span
                        className={`line-number text-right text-neutral-600 ${index === 3 ? 'text-secondary-400' : ''}`}
                      >
                        {index + 1}
                      </span>
                      <code className="code-content min-w-0">{line}</code>
                      <div className="flex justify-end pr-1">
                        {index === 3 ? (
                          <Button
                            aria-label="Add comment on line 4"
                            className="h-9 w-9 rounded-lg p-0"
                            size="icon"
                            type="button"
                            variant="primary"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        ) : (
                          <span aria-hidden="true" className="block h-9 w-9" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 px-4 py-6">
                <Card className="space-y-3" surface="subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-text-strong">
                        Review status
                      </div>
                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        Two reviewers have responded. One approval and one request for
                        changes are still open.
                      </p>
                    </div>
                    <Badge variant="warning">Action needed</Badge>
                  </div>
                </Card>

                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                    Comments ({visibleMobileComments.length})
                  </h2>
                  <div aria-label="Comment filters" className="flex gap-2 text-xs" role="tablist">
                    <button
                      aria-selected={mobileCommentFilter === 'unresolved'}
                      className={cn(
                        'font-medium',
                        mobileCommentFilter === 'unresolved'
                          ? 'text-brand'
                          : 'text-text-muted',
                      )}
                      onClick={() => setMobileCommentFilter('unresolved')}
                      role="tab"
                      type="button"
                    >
                      Unresolved
                    </button>
                    <button
                      aria-selected={mobileCommentFilter === 'all'}
                      className={cn(
                        'font-medium',
                        mobileCommentFilter === 'all' ? 'text-brand' : 'text-text-muted',
                      )}
                      onClick={() => setMobileCommentFilter('all')}
                      role="tab"
                      type="button"
                    >
                      All
                    </button>
                  </div>
                </div>

                {visibleMobileComments.map((comment) =>
                  comment.status === 'unresolved' ? (
                    <Card key={comment.author} className="overflow-hidden" elevated padding="none">
                      <div className="flex items-start gap-3 border-b border-gray-100 p-4">
                        <Avatar className="h-8 w-8" initials="JD" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{comment.body}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50/60 p-4 pl-12">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-6 w-6 text-xs" initials="JS" tone="emerald" />
                          <div className="flex-1">
                            <span className="text-xs font-semibold">
                              John Smith
                              <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                                Author
                              </span>
                            </span>
                            <p className="mt-1 text-xs text-gray-600">
                              It&apos;s handled inside the helper function. I&apos;ll add a
                              clarifying comment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card
                      key={comment.author}
                      className="overflow-hidden border-dashed bg-white/70"
                      padding="none"
                    >
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Check className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-medium italic text-gray-600">
                              Resolved by @{comment.author}
                            </span>
                            <p className="mt-1 text-xs text-gray-500">{comment.body}</p>
                          </div>
                        </div>
                        <Badge variant="success">Resolved</Badge>
                      </div>
                    </Card>
                  ),
                )}
              </section>
            </main>

            <nav className="safe-bottom-lg fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:max-w-lg sm:px-6 lg:max-w-xl">
              {mobileDetailNavItems.map((item) => {
                const Icon = item.icon
                const active = item.label === 'Files'
                return (
                  <button
                    key={item.label}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex flex-col items-center gap-1',
                      active ? 'text-blue-600' : 'text-gray-400',
                    )}
                    onClick={() => navigate(item.path)}
                    type="button"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </PhoneViewport>
        </div>

        <div className="hidden lg:block">
          <DesktopViewport className="min-h-[820px]">
            <header className="border-b border-neutral-200 bg-white">
              <WorkspaceShell wide className="flex min-h-14 flex-col gap-3 px-4 py-3 lg:px-6 xl:h-14 xl:flex-row xl:items-center xl:justify-between xl:py-0">
                <div className="flex min-w-0 items-center gap-4">
                  <Button
                    aria-label="Go back"
                    className="text-text-body"
                    onClick={() => navigate('/dashboard')}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold tracking-tight text-text-strong">
                      Debounce Utility
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 xl:mt-0">
                      <Badge variant="info">TypeScript</Badge>
                      <Badge variant="neutral">Public</Badge>
                      <div className="relative flex items-center gap-1.5 rounded border border-warning-100 bg-warning-50 px-2 py-0.5 text-xs font-bold text-warning-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse-ring" />
                        IN REVIEW
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                  <Button
                    onClick={() => navigate('/reviews/402')}
                    type="button"
                    variant="outline"
                  >
                    Open Review Workspace
                  </Button>
                  <Button
                    onClick={() => showActionToast('Reply composer opened for the active thread.')}
                    type="button"
                    variant="primary"
                  >
                    Reply to Thread
                  </Button>
                  <Button
                    onClick={() => showActionToast('Jumped to the next unresolved issue.')}
                    type="button"
                    variant="secondary"
                  >
                    Resolve Next Issue
                  </Button>
                </div>
              </WorkspaceShell>
            </header>

            <WorkspaceShell wide className="px-4 py-6 lg:px-6 lg:py-8">
              <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <Card className="hero-brand-gradient text-white">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        Needs attention first
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                        Clear the unresolved review work before exporting or sharing anything
                      </h2>
                      <p className="mt-3 max-w-[60ch] text-sm leading-7 text-neutral-300">
                        The highest-value next step is to reply to the open thread and resolve the
                        orphaned comment. Everything else can wait until the review conversation is clean.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        Open threads
                      </div>
                      <div className="mt-2 text-3xl font-bold text-white">2</div>
                    </div>
                  </div>
                </Card>
                <Card className="space-y-3" elevated>
                  <div className="text-sm font-semibold text-text-strong">Current status</div>
                  <div className="rounded-2xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700">
                    One reviewer approved, one requested changes, and one orphaned comment
                    still needs follow-up.
                  </div>
                  <div className="space-y-2">
                    {unresolvedWorkItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-text-body"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <main className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,380px)] xl:items-start">
              <section className="surface-dark radius-shell code-panel min-h-[32rem] overflow-hidden text-neutral-300 shadow-soft">
                <div className="flex items-center gap-2 border-b border-warning-500/25 bg-warning-950/20 px-6 py-2 text-xs text-warning-200">
                  <AlertTriangle className="h-4 w-4" />
                  This file has changed. 1 comment is now orphaned and may no
                  longer match the code below.
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-neutral-800 px-6 py-3 text-sm text-neutral-300">
                  <div>
                    <span className="font-semibold text-white">Line {selectedDesktopLine} selected.</span>{' '}
                    Use the inline action to comment, or right-click for more actions.
                  </div>
                  <Badge variant="neutral">2 open threads</Badge>
                </div>
                <div className="py-4 font-mono text-sm leading-6 text-neutral-400">
                  {desktopCodeLines.map((line, index) => (
                    <div
                      key={`${index + 1}-${line}`}
                      className={index === 5 ? 'border-l-2 border-secondary-500 bg-secondary-500/5' : ''}
                    >
                      <ContextMenu
                        items={[
                          {
                            label: `Add comment on line ${index + 1}`,
                            onSelect: () => {
                              setSelectedDesktopLine(index + 1)
                              showActionToast(`Ready to comment on line ${index + 1}.`)
                            },
                          },
                          {
                            label: `Copy link to line ${index + 1}`,
                            onSelect: () =>
                              copyToClipboard(
                                `reviewly://submissions/402#line-${index + 1}`,
                                `Copied link to line ${index + 1}.`,
                              ),
                          },
                          {
                            label: `Copy line ${index + 1}`,
                            onSelect: () =>
                              copyToClipboard(line, `Copied line ${index + 1} to clipboard.`),
                          },
                        ]}
                      >
                        <div
                          aria-label={`Code line ${index + 1}: ${line || 'blank line'}`}
                          aria-pressed={selectedDesktopLine === index + 1}
                          className={cn(
                            'group grid cursor-pointer grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 px-4 pr-6 transition',
                            selectedDesktopLine === index + 1 &&
                              'bg-white/10 ring-1 ring-inset ring-brand/50',
                          )}
                          onClick={() => setSelectedDesktopLine(index + 1)}
                          onFocus={() => setSelectedDesktopLine(index + 1)}
                          onKeyDown={(event) => {
                            if (event.key === 'ArrowDown') {
                              event.preventDefault()
                              focusDesktopLine(Math.min(desktopCodeLines.length, index + 2))
                            } else if (event.key === 'ArrowUp') {
                              event.preventDefault()
                              focusDesktopLine(Math.max(1, index))
                            } else if (event.key === 'Home') {
                              event.preventDefault()
                              focusDesktopLine(1)
                            } else if (event.key === 'End') {
                              event.preventDefault()
                              focusDesktopLine(desktopCodeLines.length)
                            } else if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              setSelectedDesktopLine(index + 1)
                            } else if (event.key.toLowerCase() === 'c') {
                              event.preventDefault()
                              setSelectedDesktopLine(index + 1)
                              showActionToast(`Ready to comment on line ${index + 1}.`)
                            }
                          }}
                          role="button"
                          ref={(node) => {
                            desktopLineRefs.current[index] = node
                          }}
                          tabIndex={0}
                        >
                          <div className="select-none text-right opacity-30">{index + 1}</div>
                          <div className="flex min-w-0 items-center justify-between gap-3">
                            <span className={cn(index === 5 && 'text-zinc-100')}>{line}</span>
                            {index === 5 ? (
                              <span className="rounded-full bg-secondary-600 px-1.5 text-xs font-bold text-white">
                                2
                              </span>
                            ) : null}
                          </div>
                          <div
                            className={cn(
                              'flex items-center gap-2 transition',
                              selectedDesktopLine === index + 1 || index === 5
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          >
                            <Tooltip content={`Add comment on line ${index + 1}`}>
                              <Button
                                aria-label={`Add comment on line ${index + 1}`}
                                className="h-8 w-8 rounded-lg p-0 hover:bg-brand-500"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setSelectedDesktopLine(index + 1)
                                  showActionToast(`Ready to comment on line ${index + 1}.`)
                                }}
                                size="icon"
                                type="button"
                                variant="primary"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </Tooltip>
                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                              More in menu
                            </span>
                          </div>
                        </div>
                      </ContextMenu>
                      {index === 5 && (
                        <div className="surface-dark-soft mx-6 my-2 ml-12 overflow-hidden rounded-md border-y border-zinc-800">
                          <div className="space-y-4 p-4">
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8" initials="SC" />
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-semibold text-zinc-100">
                                    sarah_codes
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    2 hours ago
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-300">
                                  Consider adding a generic for the return type as
                                  well. It might make the hook more flexible for async
                                  operations.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3 border-l border-zinc-800 pl-11">
                              <Avatar className="h-8 w-8" initials="DM" tone="emerald" />
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-semibold text-zinc-100">
                                    dev_mark
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    1 hour ago
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-300">
                                  Agreed. The <code className="rounded bg-zinc-800 px-1 text-zinc-100">any</code>{' '}
                                  constraint is a bit dangerous here.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <Textarea
                              aria-label="Write a reply to this thread"
                              className="surface-dark h-20 rounded-md border-neutral-800 p-3 text-sm text-white placeholder:text-neutral-500 focus:border-brand"
                              placeholder="Write a reply..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    aria-label="Show one resolved comment"
                    className="ml-16 my-2 flex cursor-pointer items-center gap-2 text-zinc-500 transition hover:text-zinc-300"
                    type="button"
                  >
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                      1 Resolved Comment
                    </span>
                  </button>
                  {desktopTailLines.map((line, index) => (
                    <div key={`${line}-${index}`} className="flex">
                      <div className="w-12 select-none pr-4 text-right opacity-30">
                        {index + 13}
                      </div>
                      <div className="flex-1">{line}</div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="surface-page radius-shell self-start border border-neutral-200 px-4 py-6 shadow-soft sm:px-6 sm:py-8 xl:sticky xl:top-8">
                <section className="mb-10">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Next actions
                  </h3>
                  <div className="space-y-3">
                    {unresolvedWorkItems.map((item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {index === 0 ? 'Start here to unblock the review conversation.' : 'Resolve after the active reply is posted.'}
                            </p>
                          </div>
                          <Badge variant={index === 0 ? 'warning' : 'neutral'}>
                            {index === 0 ? 'Now' : 'Next'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Reviewers
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        initials: 'SH',
                        role: 'Principal Engineer',
                        status: 'Approved',
                        tone: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                      },
                      {
                        initials: 'MT',
                        role: 'Senior Frontend',
                        status: 'Changes Requested',
                        tone: 'text-amber-600 bg-amber-50 border-amber-100',
                      },
                    ].map((reviewer) => (
                      <div
                        key={reviewer.initials}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8" initials={reviewer.initials} />
                          <div>
                            <p className="text-xs font-semibold">
                              {reviewer.initials === 'SH'
                                ? 'Sarah Henderson'
                                : 'Mark Thompson'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {reviewer.role}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${reviewer.tone}`}
                        >
                          {reviewer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Dimensions Requested
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Readability', 'Performance', 'Security', 'Testability'].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </section>

                <section className="mb-10">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Submission Info
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    {[
                      ['Submitted by', 'Alex Rivera'],
                      ['Date', 'Oct 24, 2023'],
                      ['Lines', '42'],
                      ['Priority', 'High'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="mb-0.5 text-xs text-gray-400">{label}</p>
                        {label === 'Priority' ? (
                          <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-bold uppercase text-red-500">
                            {value}
                          </span>
                        ) : (
                          <p className="text-xs font-medium">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Reporting
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 shadow-sm">
                    <p>Export becomes useful after the unresolved discussion is cleaned up.</p>
                    <Button
                      block
                      onClick={() => navigate('/reports/402')}
                      type="button"
                      variant="outline"
                    >
                      View Latest Report
                    </Button>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Activity Timeline
                  </h3>
                  <div className="relative space-y-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-gray-200 before:content-['']">
                    {[
                      'Submission Created',
                      'Sarah Henderson added a comment',
                      'Mark Thompson requested changes',
                      'Sarah Henderson approved',
                      'Comment resolved',
                    ].map((entry, index) => (
                      <div key={entry} className="relative pl-7">
                        <div
                          className={`absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-2 border-white ${index === 0 ? 'bg-zinc-900' : 'bg-gray-200'}`}
                        />
                        <p className="text-xs font-semibold text-gray-700">{entry}</p>
                        <p className="text-xs text-gray-500">
                          {index === 0 ? 'Alex Rivera • 5h ago' : 'Timeline event'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </main>
              <Toast message={actionToast ?? ''} visible={Boolean(actionToast)} />
            </WorkspaceShell>
          </DesktopViewport>
        </div>
      </ScreenCanvas>
    </div>
  )
}
