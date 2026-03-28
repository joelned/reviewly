import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="rounded-md p-1"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn('h-6 w-6 transition-colors', star <= value ? 'fill-warning text-warning' : 'text-zinc-600')}
          />
        </button>
      ))}
    </div>
  )
}

