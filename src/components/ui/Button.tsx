import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'soft'
  | 'context'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    block?: boolean
    iconOnlyLabel?: string
    leadingIcon?: ReactNode
    loading?: boolean
    shortcutHint?: ReactNode
    size?: ButtonSize
    trailingIcon?: ReactNode
    variant?: ButtonVariant
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    'bg-danger text-white shadow-md shadow-danger/20 hover:bg-danger-700 active:bg-danger-800 disabled:bg-danger-300',
  ghost:
    'bg-transparent text-text-body hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400',
  outline:
    'border border-neutral-300 bg-white text-text-body hover:bg-neutral-50 active:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400',
  context:
    'border border-neutral-200 bg-white text-text-body shadow-sm hover:border-neutral-300 hover:bg-neutral-50 hover:text-text-strong active:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400',
  primary:
    'bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300',
  secondary:
    'border border-neutral-200 bg-white text-text-strong shadow-sm hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 disabled:border-neutral-100 disabled:bg-neutral-50 disabled:text-neutral-400',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200 disabled:bg-neutral-100 disabled:text-neutral-400',
}

const sizeClasses: Record<ButtonSize, string> = {
  icon: 'h-11 w-11 rounded-xl p-0',
  lg: 'min-h-[48px] rounded-2xl px-6 py-3 text-sm font-semibold',
  md: 'min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-medium',
  sm: 'min-h-[40px] rounded-xl px-3.5 py-2 text-sm font-medium',
}

export function Button({
  block,
  children,
  className,
  disabled,
  iconOnlyLabel,
  leadingIcon,
  loading,
  shortcutHint,
  size = 'md',
  trailingIcon,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const ariaLabel =
    props['aria-label'] ??
    (size === 'icon' && !children ? iconOnlyLabel : undefined)
  const title = props.title ?? (size === 'icon' && typeof ariaLabel === 'string' ? ariaLabel : undefined)

  return (
    <button
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      className={cn(
        'touch-target inline-flex items-center justify-center gap-2 transition active:scale-[0.99] focus-visible:ring-brand disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100',
        sizeClasses[size],
        variantClasses[variant],
        block && 'w-full',
        className,
      )}
      disabled={isDisabled}
      title={title}
      type={type}
      {...props}
    >
      {loading || leadingIcon ? (
        <span className="inline-flex w-4 shrink-0 items-center justify-center">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : leadingIcon}
        </span>
      ) : null}
      {children ? <span className="min-w-0 truncate">{children}</span> : null}
      {!loading && shortcutHint ? (
        <span className="hidden rounded-md border border-current/10 bg-white/70 px-1.5 py-0.5 text-xs font-medium text-current/55 lg:inline-flex">
          {shortcutHint}
        </span>
      ) : null}
      {!loading ? trailingIcon : null}
    </button>
  )
}
