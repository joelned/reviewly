import { CalendarRange, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submissionStatusOptions } from '@/lib/constants'
import { type SubmissionListParams, type SubmissionStatus } from '@/types'

interface SubmissionFiltersProps {
  params: SubmissionListParams
  onChange: (next: SubmissionListParams) => void
  languages: string[]
}

export function SubmissionFilters({ params, onChange, languages }: SubmissionFiltersProps) {
  const statuses = params.statuses ?? []

  function toggleStatus(status: SubmissionStatus) {
    const next = statuses.includes(status)
      ? statuses.filter((item) => item !== status)
      : [...statuses, status]
    onChange({ ...params, page: 1, statuses: next })
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface/70 p-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_220px_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={params.search ?? ''}
            onChange={(event) => onChange({ ...params, search: event.target.value, page: 1 })}
            placeholder="Search submissions, language, or description"
            className="pl-9"
          />
        </div>
        <Select
          value={params.language ?? 'all'}
          onValueChange={(value) =>
            onChange({
              ...params,
              language: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="date"
            value={params.date_from ?? ''}
            onChange={(event) => onChange({ ...params, date_from: event.target.value || undefined, page: 1 })}
            className="pl-9"
          />
        </div>
        <Input
          type="date"
          value={params.date_to ?? ''}
          onChange={(event) => onChange({ ...params, date_to: event.target.value || undefined, page: 1 })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {submissionStatusOptions.map((status) => (
          <Button
            key={status}
            type="button"
            variant={statuses.includes(status) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleStatus(status)}
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  )
}
