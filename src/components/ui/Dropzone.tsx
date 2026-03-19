import { useRef, useState, type DragEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { UploadCloud } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { cn } from '../../lib/cn'

export function Dropzone({
  accept,
  className,
  description,
  label,
  onFiles,
}: {
  accept?: InputHTMLAttributes<HTMLInputElement>['accept']
  className?: string
  description?: ReactNode
  label: ReactNode
  onFiles: (files: FileList) => void
}) {
  const [dragActive, setDragActive] = useState(false)
  const [dragAccepting, setDragAccepting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return
    onFiles(files)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(true)
    setDragAccepting(Boolean(event.dataTransfer.items.length))
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragActive(false)
      setDragAccepting(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    setDragAccepting(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <Card
      className={cn('border-dashed', className)}
      dropState={dragAccepting ? 'accepting' : dragActive ? 'active' : 'idle'}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="group"
    >
      <input
        accept={accept}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
        ref={inputRef}
        type="file"
      />
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-text-body">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-text-strong">{label}</div>
          {description ? (
            <div className="text-sm leading-6 text-text-muted">{description}</div>
          ) : null}
        </div>
        <Button
          onClick={() => inputRef.current?.click()}
          type="button"
          variant="outline"
        >
          Choose file
        </Button>
      </div>
    </Card>
  )
}
