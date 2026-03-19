import { useMemo } from 'react'
import { cn } from '../../lib/cn'

type Option<T extends string> = {
  label: string
  value: T
}

export function SegmentedControl<T extends string>({
  ariaLabel,
  className,
  onChange,
  options,
  value,
}: {
  ariaLabel?: string
  className?: string
  onChange: (value: T) => void
  options: Option<T>[]
  value: T
}) {
  const activeIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  )

  const moveSelection = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + options.length) % options.length
    onChange(options[normalizedIndex].value)
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn('flex rounded-xl border border-neutral-200 bg-neutral-100/80 p-1', className)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          moveSelection(activeIndex + 1)
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault()
          moveSelection(activeIndex - 1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          onChange(options[0].value)
        } else if (event.key === 'End') {
          event.preventDefault()
          onChange(options[options.length - 1].value)
        }
      }}
      role="radiogroup"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            aria-checked={active}
            className={cn(
              'touch-target flex-1 rounded-lg px-3 py-2 text-sm font-medium transition',
              active
                ? 'border border-neutral-200 bg-white text-text-strong shadow-sm'
                : 'text-text-body hover:bg-white/60 hover:text-text-strong',
            )}
            onClick={() => onChange(option.value)}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
