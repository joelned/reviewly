import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    dropState?: 'idle' | 'active' | 'accepting'
    elevated?: boolean
    interactive?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    surface?: 'default' | 'subtle' | 'dark'
  }
>

const paddingClasses = {
  lg: 'p-6',
  md: 'p-4',
  none: 'p-0',
  sm: 'p-3',
  xl: 'p-8',
}

const surfaceClasses = {
  dark: 'border-neutral-800 surface-dark text-neutral-100',
  default: 'border-neutral-200 bg-white text-text-strong',
  subtle: 'border-neutral-200 surface-subtle text-text-strong',
}

export function Card({
  children,
  className,
  dropState = 'idle',
  elevated,
  interactive,
  padding = 'md',
  surface = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        paddingClasses[padding],
        surfaceClasses[surface],
        elevated && 'shadow-sm shadow-neutral-950/5',
        interactive && 'transition hover:border-neutral-300 hover:shadow-md hover:shadow-neutral-950/10',
        dropState === 'active' &&
          'border-dashed border-brand surface-brand-soft shadow-md shadow-brand/10',
        dropState === 'accepting' &&
          'border-dashed border-success-500 surface-success-soft shadow-md shadow-success/10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mb-4 space-y-1', className)}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <h3 className={cn('text-base font-semibold text-text-strong', className)}>{children}</h3>
}

export function CardDescription({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <p className={cn('text-sm leading-6 text-text-muted', className)}>{children}</p>
}

export function CardContent({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}
