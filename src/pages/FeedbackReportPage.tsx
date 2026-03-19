import { useState } from 'react'
import {
  Archive,
  BarChart3,
  ChevronDown,
  Code2,
  Download,
  MessageSquare,
  Share2,
  Star,
  User,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  DesktopViewport,
  ReadingColumn,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Toast } from '../components/ui/Toast'
import { cn } from '../lib/cn'

const reviewerCards = [
  {
    body:
      'Overall a very solid implementation. The separation of concerns between the auth hooks and the UI components is well-executed.',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    role: 'Senior Staff Engineer @ Acme',
    score: '8.2',
  },
  {
    body:
      'Security measures are top-notch. I recommend adding a retry limit on the client side to prevent unnecessary API hammering on failed attempts.',
    initials: 'MK',
    name: 'Marcus Kane',
    role: 'Security Lead',
    score: '7.4',
  },
]

export function FeedbackReportPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string[]>(['Sarah Jenkins'])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [archived, setArchived] = useState(false)

  const toggle = (name: string) => {
    setExpanded((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    )
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleArchive = () => {
    setArchived(true)
    showToast('Report archived. You can reopen it from reports history.')
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent p-0">
        <DesktopViewport className="bg-white text-text-strong">
          <WorkspaceShell wide className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 xl:px-10">
          <main className="radius-shell-lg relative min-h-[calc(100svh-3rem)] bg-white px-4 py-8 shadow-soft sm:px-6 sm:py-10 md:px-10 md:py-12 xl:px-12">
            <header className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-neutral-100 pb-8 md:flex-row">
              <ReadingColumn className="space-y-2">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Reviewly.
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-text-strong">
                  User Authentication Refactor
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Alex Rivers
                  </span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs">
                    TypeScript
                  </span>
                  <span>Oct 24, 2023</span>
                  <Badge variant="success">COMPLETED</Badge>
                </div>
              </ReadingColumn>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => navigate('/reviews/402')} type="button" variant="ghost">
                  Back to review
                </Button>
                <Button onClick={() => navigate('/dashboard')} type="button" variant="ghost">
                  Dashboard
                </Button>
                <Button
                  leadingIcon={<Download className="h-4 w-4" />}
                  onClick={handlePrint}
                  type="button"
                  variant="ghost"
                >
                  Print view
                </Button>
              </div>
            </header>

            <Card className="mb-10" surface="subtle">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_280px] xl:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-text-strong">
                    Executive summary
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-text-body">
                    The submission was reviewed positively overall, with strong marks in
                    security and readability. The main follow-up areas are loading-state
                    UX and token-storage safety.
                  </p>
                </div>
                <Badge className="self-start md:self-auto" variant="brand">
                  Ready to share
                </Badge>
              </div>
            </Card>

            <section className="mb-12">
              <SectionHeader
                className="mb-6"
                title={
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-brand" />
                    Assessment Overview
                  </span>
                }
              />
              <Card className="grid items-center gap-6 p-4 sm:p-6 md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:p-8" surface="subtle">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        className="text-neutral-200"
                        cx="64"
                        cy="64"
                        fill="transparent"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                      />
                      <circle
                        className="text-brand"
                        cx="64"
                        cy="64"
                        fill="transparent"
                        r="40"
                        stroke="currentColor"
                        strokeDasharray="251.2"
                        strokeDashoffset="55.26"
                        strokeLinecap="round"
                        strokeWidth="8"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">7.8</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-text-muted">
                    Overall Score
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Readability', '8.5', 'Clear naming conventions and concise logic flow.'],
                    ['Performance', '7.2', 'Consider memoizing the auth context provider.'],
                    ['Security', '9.0', 'Excellent credential handling and sanitization.'],
                    ['Testability', '6.5', 'Missing edge case coverage for token expiry.'],
                  ].map(([title, score, body]) => (
                    <Card key={title} elevated surface="default">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                          {title}
                        </span>
                        <span className="text-sm font-bold text-text-strong">
                          {score}
                        </span>
                      </div>
                      <div className="mb-2 flex text-amber-400">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              'h-3 w-3',
                              index < 4 || title === 'Security'
                                ? 'fill-current'
                                : 'text-neutral-200',
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs leading-6 text-text-body">
                        {body}
                      </p>
                    </Card>
                  ))}
                </div>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-brand" />
                Reviewer Feedback
              </h2>
              <div className="space-y-4">
                {reviewerCards.map((reviewer) => {
                  const isOpen = expanded.includes(reviewer.name)
                  return (
                    <Card
                      key={reviewer.name}
                      className="overflow-hidden border-neutral-200 bg-white"
                      padding="none"
                      surface="default"
                    >
                      <Button
                        block
                        className="justify-between bg-white p-4 text-left text-text-strong hover:bg-neutral-50 hover:text-text-strong"
                        onClick={() => toggle(reviewer.name)}
                        type="button"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10" initials={reviewer.initials} />
                          <div>
                            <h3 className="text-base font-semibold text-text-strong">{reviewer.name}</h3>
                            <p className="text-xs text-text-muted">
                              {reviewer.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="px-3 py-1 text-sm font-bold" variant="brand">
                            {reviewer.score}
                          </Badge>
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 text-text-muted transition',
                              isOpen && 'rotate-180',
                            )}
                          />
                        </div>
                      </Button>
                      {isOpen && (
                        <div className="surface-subtle border-t border-neutral-200 p-6">
                          <Card className="p-4" surface="default">
                            <p className="text-sm leading-6 text-text-body">
                              {reviewer.body}
                            </p>
                          </Card>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-brand" />
                Annotated Comments
              </h2>
              <div className="space-y-6">
                {[
                  [
                    'L:42-45',
                    'Sarah Jenkins • 2 hours ago',
                    'RESOLVED',
                    'Consider using a skeleton loader here instead of a generic spinner for a better CLS score.',
                  ],
                  [
                    'L:112',
                    'Marcus Kane • 1 hour ago',
                    'Orphaned',
                    'Are we sure we want to use localStorage? HttpOnly cookies might be safer against XSS.',
                  ],
                ].map(([line, meta, status, body], index) => (
                  <Card
                    key={line}
                    className="relative overflow-hidden border-neutral-200 bg-white"
                    surface="default"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="surface-dark rounded px-2 py-0.5 font-mono text-xs font-bold text-neutral-200">
                          {line}
                        </span>
                        <span className="text-xs font-medium text-text-muted">
                          {meta}
                        </span>
                        <Badge
                          className="ml-auto"
                          variant={status === 'RESOLVED' ? 'success' : 'warning'}
                        >
                          {status}
                        </Badge>
                      </div>
                      <div className="rounded-2xl border border-neutral-200 surface-subtle px-4 py-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                          Evidence from file
                        </div>
                        <div className="surface-dark overflow-x-auto rounded-2xl p-4">
                          <code className="font-mono text-xs text-neutral-300">
                            {index === 0
                              ? 'const { user, loading, error } = useAuth();\nif (loading) return <Spinner />;'
                              : "localStorage.setItem('auth_token', token);"}
                          </code>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-neutral-200 surface-subtle p-4 text-sm text-text-body">
                        {body}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Code2 className="h-5 w-5 text-brand" />
                  File Snapshot
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  src/hooks/useAuth.tsx
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="flex gap-2 border-b border-neutral-200 surface-subtle px-4 py-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="surface-dark overflow-x-auto p-6">
                  <pre className="font-mono text-xs leading-6 text-neutral-300">
                    1 | import {'{'} useState, useEffect {'}'} from 'react';{'\n'}
                    2 | {'\n'}
                    3 | export const useAuth = () =&gt; {'{'}{'\n'}
                    4 |   const [user, setUser] = useState(null);{'\n'}
                    42|   const {'{'} user, loading, error {'}'} = useAuth();{'\n'}
                    43|   if (loading) return &lt;Spinner /&gt;;{'\n'}
                    112|   localStorage.setItem('auth_token', token);{'\n'}
                    113| {'}'};
                  </pre>
                </div>
              </div>
            </section>

            <Card className="mt-16" surface="subtle">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-text-strong">Finalize this report</div>
                  <p className="mt-1 text-sm leading-6 text-text-body">
                    Share or export once you are ready to preserve this review as a clean record.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                  <Button
                    onClick={() => showToast('Report link copied to clipboard!')}
                    type="button"
                    variant="outline"
                    leadingIcon={<Share2 className="h-4 w-4" />}
                  >
                    Share Report
                  </Button>
                  <Button
                    disabled={archived}
                    leadingIcon={<Archive className="h-4 w-4" />}
                    onClick={handleArchive}
                    type="button"
                    variant="outline"
                  >
                    {archived ? 'Archived' : 'Archive'}
                  </Button>
                  <Button
                    leadingIcon={<Download className="h-4 w-4" />}
                    onClick={handlePrint}
                    type="button"
                    variant="primary"
                  >
                    Export Final PDF
                  </Button>
                </div>
              </div>
            </Card>
            <Toast message={toastMessage ?? ''} visible={Boolean(toastMessage)} />
          </main>
          </WorkspaceShell>
        </DesktopViewport>
      </ScreenCanvas>
    </div>
  )
}
