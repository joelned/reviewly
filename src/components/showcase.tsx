import type { PropsWithChildren } from 'react'
import { cn } from '../lib/cn'

export function ScreenCanvas({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'workspace-shell mx-auto w-full p-2 sm:p-4 lg:p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function WorkspaceShell({
  children,
  className,
  wide,
}: PropsWithChildren<{ className?: string; wide?: boolean }>) {
  return (
    <div
      className={cn(
        wide ? 'workspace-shell-wide' : 'workspace-content',
        'w-full',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ReadingColumn({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('max-readable w-full', className)}>{children}</div>
}

export function DesktopViewport({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'desktop-panel radius-shell w-full overflow-hidden bg-white lg:border lg:border-neutral-200 lg:shadow-float sm:radius-shell-lg',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PhoneViewport({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="mx-auto w-full max-w-full sm:max-w-lg">
      <div
        className={cn(
          'radius-shell overflow-hidden border border-neutral-200 bg-white shadow-float sm:radius-shell-lg',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Avatar({
  initials,
  tone = 'indigo',
  className,
}: {
  initials: string
  tone?: 'indigo' | 'emerald' | 'amber' | 'slate' | 'rose'
  className?: string
}) {
  const tones = {
    amber: 'from-warning-400 to-warning-600',
    emerald: 'from-brand-400 to-accent-500',
    indigo: 'from-brand-500 to-secondary-600',
    rose: 'from-danger-400 to-danger-600',
    slate: 'from-neutral-500 to-neutral-700',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white',
        tones[tone],
        className,
      )}
    >
      {initials}
    </div>
  )
}
