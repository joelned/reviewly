import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'

type BadgeVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'brand'

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'border-brand-100 bg-brand-50 text-brand-700',
  danger: 'border-danger-100 bg-danger-50 text-danger-700',
  info: 'border-info-100 bg-info-50 text-info-700',
  neutral: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  success: 'border-success-100 bg-success-50 text-success-700',
  warning: 'border-warning-100 bg-warning-50 text-warning-700',
}

export function Badge({
  children,
  className,
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant
  }
>) {
  const variant = (props as { variant?: BadgeVariant }).variant ?? 'neutral'
  const { variant: _variant, ...rest } = props as HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-4',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
