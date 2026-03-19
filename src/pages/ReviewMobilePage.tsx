import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DesktopViewport,
  PhoneViewport,
  ScreenCanvas,
  WorkspaceShell,
} from '../components/showcase'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Field'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Toast } from '../components/ui/Toast'
import { cn } from '../lib/cn'

const dimensions = [
  { key: 'readability', title: 'Readability' },
  { key: 'performance', title: 'Performance' },
  { key: 'security', title: 'Security' },
  { key: 'testability', title: 'Testability' },
]

const codeLines = [
  "import { useState, useEffect } from 'react';",
  '',
  'export function useDebounce<T>(value: T, delay: number): T {',
  '  const [debouncedValue, setDebouncedValue] = useState(value);',
  '',
  '  useEffect(() => {',
  '    const handler = setTimeout(() => {',
  '      setDebouncedValue(value);',
  '    }, delay);',
  '',
  '    return () => {',
  '      clearTimeout(handler);',
  '    };',
  '  }, [value, delay]);',
  '',
  '  return debouncedValue;',
  '}',
]

type DimensionKey = (typeof dimensions)[number]['key']
type DimensionScores = Record<DimensionKey, number | null>

function FeedbackPane({
  canSubmit,
  dimensionScores,
  generalFeedback,
  inlineCommentsOpen,
  onOverallScoreChange,
  overallScore,
  reviewChecklist,
  saveState,
  setDimensionScore,
  setGeneralFeedback,
  setInlineCommentsOpen,
}: {
  canSubmit: boolean
  dimensionScores: DimensionScores
  generalFeedback: string
  inlineCommentsOpen: boolean
  onOverallScoreChange: (score: number) => void
  overallScore: number | null
  reviewChecklist: Array<{ complete: boolean; label: string }>
  saveState: 'idle' | 'saved'
  setDimensionScore: (key: DimensionKey, score: number) => void
  setGeneralFeedback: (value: string) => void
  setInlineCommentsOpen: (value: boolean) => void
}) {
  const summaryTone =
    overallScore === null ? 'neutral' : overallScore >= 8 ? 'success' : overallScore >= 6 ? 'brand' : 'warning'
  const summaryLabel =
    overallScore === null ? 'Not started' : overallScore >= 8 ? 'Strong' : overallScore >= 6 ? 'Promising' : 'Needs work'

  return (
    <div className="safe-bottom-lg flex-1 overflow-y-auto p-4 pb-24 lg:p-0 lg:pb-0">
      <Card className="mb-6 space-y-3 lg:mb-5" surface="subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-text-strong">Review summary</div>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Score the submission, capture your main findings, then attach any
              code-specific notes before you submit.
            </p>
          </div>
          <Badge variant={canSubmit ? 'success' : 'neutral'}>
            {saveState === 'saved' ? 'Saved' : 'Draft'}
          </Badge>
        </div>
      </Card>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-strong">Overall Score</h3>
          <Badge variant={summaryTone}>{summaryLabel}</Badge>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:flex sm:justify-between sm:gap-1 lg:grid-cols-5 lg:justify-start">
          {Array.from({ length: 10 }, (_, index) => (
            <button
              key={index + 1}
              className={cn(
                'touch-target flex h-10 w-full items-center justify-center rounded-full border text-sm font-medium transition sm:h-9 sm:w-9 sm:text-xs',
                overallScore === index + 1
                  ? 'scale-105 border-brand bg-brand text-white ring-2 ring-brand-100'
                  : 'border-neutral-200 text-text-body hover:border-brand hover:text-brand',
              )}
              onClick={() => onOverallScoreChange(index + 1)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        {dimensions.map((item) => (
          <Card key={item.title} className="rounded-xl" surface="subtle" padding="sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-text-muted">{item.title}</p>
              <span className="text-xs text-neutral-400">
                {dimensionScores[item.key] ? `${dimensionScores[item.key]}/5` : 'Unrated'}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  aria-label={`Rate ${item.title} ${index + 1} out of 5`}
                  className="touch-target flex h-6 w-6 items-center justify-center"
                  onClick={() => setDimensionScore(item.key, index + 1)}
                  type="button"
                >
                  <Star
                    className={cn(
                      'h-3.5 w-3.5',
                      index < (dimensionScores[item.key] ?? 0)
                        ? 'fill-brand text-brand'
                        : 'text-neutral-300',
                    )}
                  />
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-text-strong">General Feedback</label>
          <span className="text-xs text-neutral-400">Markdown supported</span>
        </div>
        <Textarea
          className="min-h-[144px]"
          onChange={(event) => setGeneralFeedback(event.target.value)}
          rows={6}
          value={generalFeedback}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span>Minimum 50 characters</span>
          <span>{generalFeedback.trim().length} characters</span>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-6">
        <Button
          block
          aria-expanded={inlineCommentsOpen}
          className="justify-between px-0 hover:bg-transparent"
          onClick={() => setInlineCommentsOpen(!inlineCommentsOpen)}
          type="button"
          variant="ghost"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-strong">
            Inline Comments
            <Badge variant="neutral">1</Badge>
          </h3>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-neutral-400 transition-transform',
              inlineCommentsOpen && 'rotate-180',
            )}
          />
        </Button>
        <div className={cn('mt-3 space-y-3', !inlineCommentsOpen && 'hidden')}>
          <div className="rounded-lg border border-brand-100 bg-brand-50/60 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs text-brand">Line 3</span>
              <span className="text-xs text-neutral-400">Just now</span>
            </div>
            <p className="text-xs text-text-body">
              Consider adding a generic constraint for the T type if possible.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
          Review Checklist
        </h3>
        {reviewChecklist.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded',
                item.complete ? 'bg-brand text-white' : 'border-2 border-neutral-200',
              )}
            >
              {item.complete && <Check className="h-3.5 w-3.5" />}
            </div>
            <span className={cn('text-xs', item.complete ? 'text-text-body' : 'text-text-muted')}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {!canSubmit ? (
        <Card className="mt-6" surface="subtle">
          <p className="text-sm leading-6 text-text-body">
            Finish your score, rate each review dimension, and write at least 50
            characters of feedback before submitting.
          </p>
        </Card>
      ) : null}
    </div>
  )
}

export function ReviewMobilePage() {
  const navigate = useNavigate()
  const [view, setView] = useState<'code' | 'feedback'>('code')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [selectedReviewLine, setSelectedReviewLine] = useState(3)
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')
  const [overallScore, setOverallScore] = useState<number | null>(null)
  const [dimensionScores, setDimensionScores] = useState<DimensionScores>({
    performance: null,
    readability: null,
    security: null,
    testability: null,
  })
  const [generalFeedback, setGeneralFeedback] = useState('')
  const [inlineCommentsOpen, setInlineCommentsOpen] = useState(false)
  const reviewLineRefs = useRef<Array<HTMLDivElement | null>>([])

  const reviewChecklist = [
    { complete: overallScore !== null, label: 'Overall score given' },
    {
      complete: Object.values(dimensionScores).every((value) => value !== null),
      label: 'All dimension scores filled',
    },
    {
      complete: generalFeedback.trim().length >= 50,
      label: 'General feedback written (min 50 chars)',
    },
  ]
  const canSubmit = reviewChecklist.every((item) => item.complete)

  const handleDesktopSubmit = () => {
    if (!canSubmit) {
      setSubmitMessage('Complete the review checklist before submitting.')
      window.setTimeout(() => setSubmitMessage(null), 2200)
      return
    }
    setSubmitMessage('Review submitted successfully.')
    window.setTimeout(() => {
      setSubmitMessage(null)
      navigate('/reports/402')
    }, 700)
  }

  const handleSaveDraft = () => {
    setSaveState('saved')
    setSubmitMessage('Draft saved.')
    window.setTimeout(() => {
      setSaveState('idle')
      setSubmitMessage(null)
    }, 2200)
  }

  const setDimensionScore = (key: DimensionKey, score: number) => {
    setDimensionScores((current) => ({
      ...current,
      [key]: score,
    }))
  }

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tagName = target.tagName.toLowerCase()
      return target.isContentEditable || tagName === 'input' || tagName === 'textarea'
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      handleDesktopSubmit()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const focusReviewLine = (lineNumber: number) => {
    reviewLineRefs.current[lineNumber - 1]?.focus()
    setSelectedReviewLine(lineNumber)
  }

  return (
    <div className="animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ScreenCanvas className="bg-transparent">
        <div className="lg:hidden">
          <PhoneViewport className="surface-page">
            <header className="safe-top border-b border-neutral-200 bg-white px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-text-strong">Auth Middleware</h1>
                    <span className="text-xs text-text-muted">by @jsmith</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge variant="info">TypeScript</Badge>
                    <span className="text-xs italic text-neutral-400">
                      {saveState === 'saved' ? 'Draft saved just now' : 'Draft not yet saved'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button onClick={handleSaveDraft} size="sm" type="button" variant="outline">
                    Save
                  </Button>
                  <Button
                    disabled={!canSubmit}
                    onClick={handleDesktopSubmit}
                    size="sm"
                    type="button"
                    variant="primary"
                  >
                    Submit
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <SegmentedControl
                  ariaLabel="Review workspace view"
                  onChange={setView}
                  options={[
                    { label: 'Code', value: 'code' },
                    { label: 'Feedback', value: 'feedback' },
                  ]}
                  value={view}
                />
              </div>
            </header>

            <main className="relative min-h-[70svh] overflow-hidden sm:min-h-[60svh]">
              <section
                className={cn(
                  'surface-dark absolute inset-0 flex flex-col text-neutral-300 transition-transform duration-300',
                  view === 'code' ? 'translate-x-0 z-20' : 'translate-x-full',
                )}
              >
                <div className="surface-dark-muted border-b border-white/10 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                        Review focus
                      </div>
                      <p className="mt-1 text-sm leading-6 text-neutral-300">
                        Check the debounce implementation for readability, cleanup
                        correctness, and type safety before responding inline.
                      </p>
                    </div>
                    <Badge className="border-white/10 bg-white/10 text-white" variant="neutral">
                      Read only
                    </Badge>
                  </div>
                </div>
                <div className="surface-dark-elevated flex items-center justify-between border-b border-white/10 px-4 py-2">
                  <div className="text-xs font-mono text-neutral-500">useDebounce.ts</div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Inline comments enabled
                  </div>
                </div>
                <div className="flex-1 overflow-auto px-0 py-4 font-mono text-sm leading-6">
                  {codeLines.map((line, index) => (
                    <div
                      key={`${index + 1}-${line}`}
                      className={cn(
                        'flex px-4 transition hover:bg-white/10',
                        (index === 2 || selectedReviewLine === index + 1) &&
                          'border-l-4 border-brand bg-brand-500/10',
                      )}
                      onClick={() => setSelectedReviewLine(index + 1)}
                    >
                      <span className="w-10 shrink-0 pr-4 text-right text-neutral-600">
                        {index + 1}
                      </span>
                      <span className="flex-1">{line || ' '}</span>
                      {selectedReviewLine === index + 1 ? (
                        <button
                          aria-label={`Add comment on line ${index + 1}`}
                          className="ml-3 rounded bg-brand px-2 py-1 text-xs font-medium text-white"
                          type="button"
                        >
                          Comment
                        </button>
                      ) : null}
                    </div>
                  ))}
                  <div className="surface-dark-elevated mx-4 my-2 rounded-sm p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        JD
                      </div>
                      <div className="flex-1">
                        <Textarea
                          className="min-h-[88px] border-0 bg-transparent p-0 text-sm text-neutral-200 placeholder:text-neutral-500"
                          placeholder="Write a comment..."
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button className="text-neutral-400 hover:bg-transparent hover:text-neutral-200" size="sm" type="button" variant="ghost">
                            Cancel
                          </Button>
                          <Button size="sm" type="button" variant="primary">
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={cn(
                  'absolute inset-0 flex flex-col bg-white transition-transform duration-300',
                  view === 'feedback' ? 'translate-x-0 z-20' : 'translate-x-full',
                )}
              >
                <FeedbackPane
                  canSubmit={canSubmit}
                  dimensionScores={dimensionScores}
                  generalFeedback={generalFeedback}
                  inlineCommentsOpen={inlineCommentsOpen}
                  onOverallScoreChange={setOverallScore}
                  overallScore={overallScore}
                  reviewChecklist={reviewChecklist}
                  saveState={saveState}
                  setDimensionScore={setDimensionScore}
                  setGeneralFeedback={setGeneralFeedback}
                  setInlineCommentsOpen={setInlineCommentsOpen}
                />
              </section>
            </main>
          </PhoneViewport>
        </div>

        <div className="hidden lg:block">
          <DesktopViewport className="surface-page">
            <header className="border-b border-neutral-200 bg-white">
              <WorkspaceShell wide className="flex items-center justify-between gap-6 px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight text-text-strong">
                      Auth Middleware Review
                    </h1>
                    <Badge variant="info">TypeScript</Badge>
                    <Badge variant="brand">Draft</Badge>
                  </div>
                  <p className="mt-2 max-w-[54ch] text-sm leading-6 text-text-muted">
                    A desktop review workspace designed for reading code and writing
                    feedback side-by-side without hiding either task behind tabs.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={() => navigate('/submissions/402')} type="button" variant="ghost">
                    Back to submission
                  </Button>
                  <Button onClick={handleSaveDraft} type="button" variant="outline">
                    Save draft
                  </Button>
                  <Button
                    disabled={!canSubmit}
                    onClick={handleDesktopSubmit}
                    shortcutHint="Ctrl+Enter"
                    type="button"
                    variant="primary"
                  >
                    Submit review
                  </Button>
                </div>
              </WorkspaceShell>
            </header>

            <WorkspaceShell wide className="px-6 py-8">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,420px)]">
                <section className="surface-dark radius-shell overflow-hidden border border-neutral-200 text-neutral-300 shadow-soft">
                  <div className="surface-dark-muted border-b border-white/10 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                          Review focus
                        </div>
                        <p className="mt-2 max-w-[64ch] text-sm leading-6 text-neutral-300">
                          Check the debounce implementation for readability, cleanup
                          correctness, and type safety before responding inline.
                        </p>
                      </div>
                      <Badge className="border-white/10 bg-white/10 text-white" variant="neutral">
                        Read only
                      </Badge>
                    </div>
                  </div>
                  <div className="surface-dark-soft flex items-center justify-between border-b border-white/10 px-6 py-3">
                    <div className="text-xs font-mono text-neutral-500">useDebounce.ts</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      1 inline thread
                    </div>
                  </div>
                  <div className="max-h-[calc(100svh-18rem)] overflow-auto py-4 font-mono text-sm leading-6">
                    {codeLines.map((line, index) => (
                      <div
                        aria-label={`Code line ${index + 1}: ${line || 'blank line'}`}
                        aria-pressed={selectedReviewLine === index + 1}
                        key={`${index + 1}-${line}`}
                        className={cn(
                          'group grid grid-cols-[56px_minmax(0,1fr)_auto] items-start gap-4 px-6 py-0.5 transition hover:bg-white/10',
                          (index === 2 || selectedReviewLine === index + 1) &&
                            'border-l-4 border-brand bg-brand-500/10',
                        )}
                        onClick={() => setSelectedReviewLine(index + 1)}
                        onFocus={() => setSelectedReviewLine(index + 1)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown') {
                            event.preventDefault()
                            focusReviewLine(Math.min(codeLines.length, index + 2))
                          } else if (event.key === 'ArrowUp') {
                            event.preventDefault()
                            focusReviewLine(Math.max(1, index))
                          } else if (event.key === 'Home') {
                            event.preventDefault()
                            focusReviewLine(1)
                          } else if (event.key === 'End') {
                            event.preventDefault()
                            focusReviewLine(codeLines.length)
                          } else if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedReviewLine(index + 1)
                          }
                        }}
                        ref={(node) => {
                          reviewLineRefs.current[index] = node
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="text-right text-neutral-600">{index + 1}</span>
                        <span className="text-neutral-300">{line || ' '}</span>
                        {index === 2 || selectedReviewLine === index + 1 ? (
                          <Button
                            aria-label={`Add comment on line ${index + 1}`}
                            className="min-h-[32px] rounded-lg px-2 py-1 text-xs font-medium opacity-100 group-hover:bg-brand-500"
                            size="sm"
                            type="button"
                            variant="primary"
                          >
                            Comment
                          </Button>
                        ) : (
                          <span className="w-16" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <aside className="radius-shell border border-neutral-200 bg-white p-6 shadow-soft">
                  <FeedbackPane
                    canSubmit={canSubmit}
                    dimensionScores={dimensionScores}
                    generalFeedback={generalFeedback}
                    inlineCommentsOpen={inlineCommentsOpen}
                    onOverallScoreChange={setOverallScore}
                    overallScore={overallScore}
                    reviewChecklist={reviewChecklist}
                    saveState={saveState}
                    setDimensionScore={setDimensionScore}
                    setGeneralFeedback={setGeneralFeedback}
                    setInlineCommentsOpen={setInlineCommentsOpen}
                  />
                </aside>
              </div>
            </WorkspaceShell>
            <Toast message={submitMessage ?? ''} visible={Boolean(submitMessage)} />
          </DesktopViewport>
        </div>
      </ScreenCanvas>
    </div>
  )
}
