import {
  cloneElement,
  isValidElement,
  useId,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

const fieldControlClasses =
  'w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-text-strong outline-none transition placeholder:text-neutral-400 focus:border-brand aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50/40'

export function Field({
  children,
  className,
  error,
  hint,
  id,
  label,
  required,
}: PropsWithChildren<{
  className?: string
  error?: ReactNode
  hint?: ReactNode
  id?: string
  label?: ReactNode
  required?: boolean
}>) {
  const generatedId = useId()
  const fieldId = id ?? `field-${generatedId.replace(/:/g, '')}`
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const content =
    isValidElement(children) && !Array.isArray(children)
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          'aria-describedby': [
            (children.props as Record<string, string | undefined>)['aria-describedby'],
            describedBy,
          ]
            .filter(Boolean)
            .join(' ') || undefined,
          'aria-invalid': error ? true : (children.props as Record<string, unknown>)['aria-invalid'],
          id: (children.props as Record<string, unknown>).id ?? fieldId,
          required:
            typeof (children.props as Record<string, unknown>).required === 'boolean'
              ? (children.props as Record<string, unknown>).required
              : required,
        })
      : children

  return (
    <div className={cn('block space-y-2', className)}>
      {label ? (
        <label className="text-ui-label block" htmlFor={fieldId}>
          {label}
          {required ? <span className="ml-1 text-danger-600">*</span> : null}
        </label>
      ) : null}
      {content}
      {hint ? (
        <span className="text-ui-meta block" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="block text-sm text-danger-600" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(fieldControlClasses, className)}
      {...props}
    />
  )
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldControlClasses,
        'appearance-none pr-10',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldControlClasses, className)}
      {...props}
    />
  )
}

export function FieldGroup({
  children,
  className,
  hint,
  legend,
}: PropsWithChildren<{ className?: string; hint?: ReactNode; legend: ReactNode }>) {
  const generatedId = useId()
  const hintId = hint ? `field-group-${generatedId.replace(/:/g, '')}` : undefined

  return (
    <fieldset aria-describedby={hintId} className={cn('space-y-3', className)}>
      <legend className="text-ui-label">{legend}</legend>
      {hint ? (
        <p className="text-ui-meta" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children}
    </fieldset>
  )
}
