import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Check,
  Github,
  Sparkles,
  Star,
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
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'
import { Tooltip } from '../components/ui/Tooltip'
import { cn } from '../lib/cn'

const activityItems = [
  ['Earned +25 Reputation', '2 hours ago • Successful Review'],
  ['Completed Review: Refactor Hook', '5 hours ago • React • 9.8 Score'],
  ['Replied to feedback', 'Yesterday • On "Auth Flow Redesign"'],
]

const reviewItems = [
  ['Refactor Hook', '9.8 score • React', 'Actionable feedback with follow-up on testing edge cases.'],
  ['API Rate Limiter', '9.1 score • Node.js', 'Strong comments on resilience, retries, and operational safety.'],
  ['Design System Tokens', '8.9 score • TypeScript', 'Focused on naming consistency and long-term maintainability.'],
]

const statsItems = [
  ['Helpful review rate', '94%'],
  ['Median turnaround', '2h'],
  ['Repeat requests', '67%'],
]

const trustSignals = [
  ['184 completed reviews', 'Consistent delivery across frontend, platform, and API changes.'],
  ['94% marked helpful', 'Teams frequently rate Sarah’s feedback as clear, actionable, and specific.'],
  ['67% repeat requests', 'A strong signal that teams come back after the first review experience.'],
]

const profileTabs = [
  { label: 'Activity', value: 'activity' },
  { label: 'Reviews', value: 'reviews' },
  { label: 'Stats', value: 'stats' },
] as const

export function ReviewerProfilePage() {
  const navigate = useNavigate()
  const { user, isReviewer } = useAuth()
  const [activeTab, setActiveTab] = useState<'activity' | 'reviews' | 'stats'>('activity')
  const [tipModalOpen, setTipModalOpen] = useState(false)
  const [selectedTip, setSelectedTip] = useState(2)
  const [customAmount, setCustomAmount] = useState('')
  const [tipProcessing, setTipProcessing] = useState(false)
  const [tipSuccess, setTipSuccess] = useState(false)

  const handleTip = () => {
    setTipProcessing(true)
    window.requestAnimationFrame(() => {
      setTipProcessing(false)
      setTipSuccess(true)
    })
    window.setTimeout(() => {
      setTipModalOpen(false)
      setTipSuccess(false)
      setCustomAmount('')
      setSelectedTip(2)
    }, 2100)
  }

  const payableAmount = customAmount.trim() ? Number(customAmount) || 0 : selectedTip
  const isOwnProfile = isReviewer && user?.username === 'sconnor_dev'

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent">
        <div className="lg:hidden">
          <PhoneViewport className="relative bg-white">
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <Button
                  aria-label="Go back"
                  className="text-slate-600"
                  onClick={() => navigate('/dashboard')}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
                <h1 className="text-lg font-semibold tracking-tight">Reviewer Profile</h1>
              </div>
            </header>

            <main className="mx-auto max-w-xl pb-24">
              <section className="animate-fade-up px-6 pb-6 pt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 p-1 text-2xl" initials="SC" />
                    <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-amber-400 p-1.5 text-white shadow-sm">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Sarah Connor</h2>
                  <p className="font-medium text-slate-500">@sconnor_dev</p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl font-black tracking-tighter text-reviewly-indigo">
                        1,248
                      </span>
                      <Tooltip content="How reputation is calculated">
                        <Button aria-label="View reputation details" className="text-slate-400" size="icon" type="button" variant="ghost">
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Total Reputation
                    </p>
                    <p className="mt-2 max-w-[32ch] text-sm leading-6 text-slate-500">
                      Reputation reflects review quality, follow-through, and how often teams return for another review.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {['TypeScript', 'React', 'Node.js', 'Python'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row">
                    <a
                      aria-label="Open Sarah Connor's GitHub profile"
                      className="flex items-center gap-1 transition hover:text-reviewly-indigo"
                      href="https://github.com"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Github className="h-4 w-4" />
                      github.com/sconnor
                    </a>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined Jan 2023
                    </span>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-3 gap-3 px-6 pb-2">
                {[
                  ['Helpful', '94%'],
                  ['Repeat', '67%'],
                  ['Response', '2h'],
                ].map(([label, value]) => (
                  <Card key={label} className="text-center" surface="subtle">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
                  </Card>
                ))}
              </section>

              <section className="px-6 pb-6">
                <Card className="space-y-3" elevated>
                  <div className="text-sm font-semibold text-slate-900">Why teams choose Sarah</div>
                  <div className="space-y-3">
                    {trustSignals.map(([title, body]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="text-sm font-semibold text-slate-900">{title}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              <div className="mb-8 grid grid-cols-1 gap-3 px-6 sm:grid-cols-2">
                {isOwnProfile ? (
                  <Button
                    block
                    onClick={() => navigate('/settings/profile')}
                    size="lg"
                    variant="outline"
                  >
                    Edit tip amount
                  </Button>
                ) : (
                  <>
                    <Button
                      block
                      onClick={() => navigate('/submissions/new')}
                      size="lg"
                      variant="primary"
                    >
                      Request Review
                    </Button>
                    <Card className="flex items-start justify-between gap-4 border-slate-200 bg-slate-50 p-4 sm:items-center" surface="subtle">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Support this reviewer</div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Optional after you’ve worked with Sarah and want to show appreciation.
                        </p>
                      </div>
                      <Button className="self-start sm:self-auto" onClick={() => setTipModalOpen(true)} size="sm" type="button" variant="ghost">
                        Tip Reviewer
                      </Button>
                    </Card>
                  </>
                )}
              </div>

              <div
                aria-label="Reviewer profile sections"
                className="hide-scrollbar sticky top-[60px] z-10 mb-6 flex items-center gap-6 overflow-x-auto border-b border-slate-100 bg-white px-6"
                role="tablist"
              >
                {profileTabs.map((tab) => (
                  <button
                    key={tab.value}
                    aria-selected={activeTab === tab.value}
                    className={cn(
                      'touch-target -mb-px px-1 pb-3 text-sm font-bold',
                      activeTab === tab.value
                        ? 'border-b-2 border-reviewly-indigo text-reviewly-indigo'
                        : 'text-slate-500',
                    )}
                    onClick={() => setActiveTab(tab.value)}
                    role="tab"
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="px-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {activeTab === 'activity'
                      ? 'Recent activity'
                      : activeTab === 'reviews'
                        ? 'Recent reviews'
                        : 'Reviewer stats'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeTab === 'activity'
                      ? 'See how Sarah has been contributing across review requests and follow-up discussions.'
                      : activeTab === 'reviews'
                        ? 'Examples of recent reviews and the type of feedback teams receive.'
                        : 'A quick snapshot of review quality, speed, and trust signals.'}
                  </p>
                </div>
              </div>

              <div className="space-y-8 px-6 pb-4">
                {activeTab === 'activity'
                  ? activityItems.map(([title, meta], index) => (
                      <div key={title} className="relative flex gap-4">
                        {index < 2 && (
                          <div className="absolute bottom-[-32px] left-[11px] top-8 w-[2px] bg-slate-100" />
                        )}
                        <div className="z-10 rounded-full border-2 border-white bg-indigo-50 p-1.5">
                          {index === 0 ? (
                            <TrendingUp className="h-3 w-3 text-reviewly-indigo" />
                          ) : index === 1 ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{meta}</p>
                        </div>
                      </div>
                    ))
                  : activeTab === 'reviews'
                    ? reviewItems.map(([title, meta, body]) => (
                        <Card key={title} className="space-y-2" surface="subtle">
                          <div className="text-sm font-semibold text-slate-900">{title}</div>
                          <div className="text-xs font-medium text-reviewly-indigo">{meta}</div>
                          <p className="text-sm leading-6 text-slate-600">{body}</p>
                        </Card>
                      ))
                    : statsItems.map(([label, value]) => (
                        <Card key={label} className="flex items-center justify-between" surface="subtle">
                          <div className="text-sm text-slate-600">{label}</div>
                          <div className="text-lg font-semibold text-slate-950">{value}</div>
                        </Card>
                      ))}
              </div>
            </main>
          </PhoneViewport>
        </div>

        <div className="hidden lg:block">
          <DesktopViewport className="bg-slate-50">
            <WorkspaceShell wide className="px-6 py-8">
              <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="space-y-6">
                  <Card elevated className="text-center">
                    <div className="relative mx-auto mb-4 w-fit">
                      <Avatar className="h-28 w-28 p-1 text-2xl" initials="SC" />
                      <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-amber-400 p-1.5 text-white shadow-sm">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Sarah Connor
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500">@sconnor_dev</p>
                    <p className="mx-auto mt-3 max-w-[32ch] text-sm leading-6 text-slate-500">
                      Known for fast, high-signal reviews on React architecture, reusable hooks, and frontend system design.
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-2">
                      <span className="text-4xl font-black tracking-tighter text-reviewly-indigo">
                        1,248
                      </span>
                      <Tooltip content="How reputation is calculated">
                        <Button aria-label="View reputation details" className="text-slate-400" size="icon" type="button" variant="ghost">
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Total reputation
                    </p>
                    <p className="mx-auto mt-2 max-w-[32ch] text-sm leading-6 text-slate-500">
                      Reputation reflects how useful, timely, and consistent Sarah’s reviews have been for past teams.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {['TypeScript', 'React', 'Node.js', 'Python'].map((tag) => (
                        <Badge key={tag} variant="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-slate-500">
                      <a
                        className="flex items-center justify-center gap-2 transition hover:text-reviewly-indigo"
                        href="https://github.com"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Github className="h-4 w-4" />
                        github.com/sconnor
                      </a>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined Jan 2023
                      </div>
                    </div>
                  </Card>

                  <Card elevated className="space-y-3">
                    <div className="text-sm font-semibold text-slate-900">Trust snapshot</div>
                    {[
                      ['Reviews completed', '184'],
                      ['Helpful review rate', '94%'],
                      ['Repeat requests', '67%'],
                      ['Median response', '2h'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <span className="text-sm text-slate-600">{label}</span>
                        <span className="text-sm font-semibold text-slate-950">{value}</span>
                      </div>
                    ))}
                  </Card>

                  <div className="space-y-3">
                    {isOwnProfile ? (
                      <Button
                        block
                        onClick={() => navigate('/settings/profile')}
                        size="lg"
                        variant="outline"
                      >
                        Edit tip amount
                      </Button>
                    ) : (
                      <>
                        <Button
                          block
                          onClick={() => navigate('/submissions/new')}
                          size="lg"
                          variant="primary"
                        >
                          Request Review
                        </Button>
                        <Card className="space-y-3 border-slate-200 bg-slate-50" surface="subtle">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Support this reviewer</div>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              Tipping is optional and makes the most sense after Sarah has helped your team.
                            </p>
                          </div>
                          <Button
                            block
                            onClick={() => setTipModalOpen(true)}
                            size="sm"
                            variant="ghost"
                          >
                            Tip Reviewer
                          </Button>
                        </Card>
                      </>
                    )}
                  </div>
                </aside>

                <main className="space-y-8">
                  <Card elevated className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Top reviewer
                        </div>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                          Deep frontend and architecture reviews with fast response times
                        </h2>
                        <p className="mt-3 max-w-[56ch] text-sm leading-7 text-slate-500">
                          Sarah specializes in React, TypeScript, and design-system level
                          feedback. Teams usually request her when they need clear guidance on
                          maintainability, API boundaries, implementation quality, and practical
                          follow-up in comment threads.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid gap-4 xl:grid-cols-3">
                    {trustSignals.map(([title, body]) => (
                      <Card key={title} elevated className="space-y-2">
                        <div className="text-base font-semibold text-slate-900">{title}</div>
                        <p className="text-sm leading-6 text-slate-500">{body}</p>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
                    <section className="space-y-6">
                      <div
                        aria-label="Reviewer profile sections"
                        className="hide-scrollbar flex items-center gap-6 overflow-x-auto border-b border-slate-200"
                        role="tablist"
                      >
                        {profileTabs.map((tab) => (
                          <button
                            key={tab.value}
                            aria-selected={activeTab === tab.value}
                            className={cn(
                              'touch-target -mb-px px-1 pb-3 text-sm font-bold',
                              activeTab === tab.value
                                ? 'border-b-2 border-reviewly-indigo text-reviewly-indigo'
                                : 'text-slate-400',
                            )}
                            onClick={() => setActiveTab(tab.value)}
                            role="tab"
                            type="button"
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <Card elevated className="space-y-6">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {activeTab === 'activity'
                              ? 'Recent activity'
                              : activeTab === 'reviews'
                                ? 'Recent reviews'
                                : 'Reviewer stats'}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {activeTab === 'activity'
                              ? 'A desktop-friendly view of recent review work, follow-ups, and reputation changes.'
                              : activeTab === 'reviews'
                                ? 'Recent examples of Sarah’s review depth, tone, and scoring.'
                                : 'Signals that help teams decide whether this reviewer is a good fit.'}
                          </p>
                        </div>

                        <div className="space-y-8">
                          {activeTab === 'activity'
                            ? activityItems.map(([title, meta], index) => (
                                <div key={title} className="relative flex gap-4">
                                  {index < activityItems.length - 1 && (
                                    <div className="absolute bottom-[-32px] left-[11px] top-8 w-[2px] bg-slate-100" />
                                  )}
                                  <div className="z-10 rounded-full border-2 border-white bg-indigo-50 p-1.5">
                                    {index === 0 ? (
                                      <TrendingUp className="h-3 w-3 text-reviewly-indigo" />
                                    ) : index === 1 ? (
                                      <Check className="h-3 w-3 text-emerald-600" />
                                    ) : (
                                      <Sparkles className="h-3 w-3 text-blue-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                                    <p className="mt-0.5 text-sm text-slate-500">{meta}</p>
                                  </div>
                                </div>
                              ))
                            : activeTab === 'reviews'
                              ? reviewItems.map(([title, meta, body]) => (
                                  <Card key={title} className="space-y-2" surface="subtle">
                                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                                    <div className="text-sm font-medium text-reviewly-indigo">{meta}</div>
                                    <p className="text-sm leading-6 text-slate-600">{body}</p>
                                  </Card>
                                ))
                              : statsItems.map(([label, value]) => (
                                  <div
                                    key={label}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                                  >
                                    <span className="text-sm text-slate-600">{label}</span>
                                    <span className="text-lg font-semibold text-slate-950">{value}</span>
                                  </div>
                                ))}
                        </div>
                      </Card>
                    </section>

                    <aside className="space-y-6">
                      <Card elevated className="space-y-4">
                        <div className="text-sm font-semibold text-slate-900">What teams value</div>
                        {[
                          'Fast, actionable feedback on React architecture',
                          'Strong attention to code readability and maintainability',
                          'Reliable follow-through on inline discussions and revisions',
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                          >
                            {item}
                          </div>
                        ))}
                      </Card>

                      <Card elevated className="space-y-4">
                        <div className="text-sm font-semibold text-slate-900">Availability</div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          Usually replies within 2 hours during working days.
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          Best fit for frontend platform work, reusable hooks, and product UI
                          architecture.
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          Strongest when the team wants concrete next steps, not just high-level critique.
                        </div>
                      </Card>
                    </aside>
                  </div>
                </main>
              </div>
            </WorkspaceShell>
          </DesktopViewport>
        </div>

        {tipModalOpen && (
          <Modal onClose={() => setTipModalOpen(false)} title="Support Sarah">
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[2, 5, 10].map((amount) => (
                <Button
                  key={amount}
                  className={cn(
                    'font-bold',
                    selectedTip === amount && !customAmount
                      ? 'border-reviewly-indigo bg-indigo-50 text-reviewly-indigo hover:bg-indigo-100'
                      : '',
                  )}
                  onClick={() => {
                    setCustomAmount('')
                    setSelectedTip(amount)
                  }}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="mb-6">
              <Field
                label={
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Custom Amount
                  </span>
                }
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>
                  <Input
                    className="rounded-2xl border-slate-200 bg-slate-50 pl-8 font-bold"
                    onChange={(event) => setCustomAmount(event.target.value)}
                    placeholder="0.00"
                    type="number"
                    value={customAmount}
                  />
                </div>
              </Field>
            </div>
            <div className="mb-8">
              <div className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Card Details
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                <div className="font-bold italic text-blue-800">VISA</div>
                <span className="text-slate-300">4242 4242 4242 4242</span>
              </div>
              <p className="mt-2 text-center text-xs italic text-slate-400">
                Secure payment powered by Stripe
              </p>
            </div>
            <Button
              block
              className={cn(tipSuccess && 'bg-emerald-500 hover:bg-emerald-600')}
              disabled={payableAmount <= 0}
              loading={tipProcessing}
              onClick={handleTip}
              size="lg"
              type="button"
              variant="primary"
            >
              {tipSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  Success!
                </>
              ) : (
                `Pay $${payableAmount.toFixed(2)}`
              )}
            </Button>
            <div aria-live="polite" className="mt-3 min-h-[1.5rem] text-center" role="status">
              {tipProcessing ? (
                <p className="animate-fade-in text-sm text-slate-500">
                  Securing your payment details...
                </p>
              ) : tipSuccess ? (
                <p className="animate-fade-in text-sm text-emerald-600">Tip sent successfully.</p>
              ) : null}
            </div>
          </Modal>
        )}
      </ScreenCanvas>
    </div>
  )
}
