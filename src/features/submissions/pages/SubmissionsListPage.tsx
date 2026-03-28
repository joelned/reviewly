import { useMemo, useState } from 'react'
import { FileSearch, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SubmissionFilters } from '@/features/submissions/components/SubmissionFilters'
import { useDebounce } from '@/hooks/useDebounce'
import { languageOptions } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useCloseSubmission } from '@/features/submissions/hooks/useSubmission'
import { useSubmissions } from '@/features/submissions/hooks/useSubmissions'
import { type SubmissionListParams } from '@/types'

export function SubmissionsListPage() {
  const user = useAuthStore((state) => state.user)
  const [params, setParams] = useState<SubmissionListParams>({
    page: 1,
    size: 6,
    statuses: [],
  })
  const debouncedSearch = useDebounce(params.search, 300)
  const query = useSubmissions({ ...params, search: debouncedSearch })
  const closeMutation = useCloseSubmission()

  const data = query.data
  const items = data?.items ?? []

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Title',
        accessor: (submission: (typeof items)[number]) => submission.title,
        sortable: true,
        cell: (submission: (typeof items)[number]) => (
          <div className="space-y-1">
            <p className="font-medium text-zinc-100">{submission.title}</p>
            <p className="text-sm text-zinc-500">{submission.description}</p>
          </div>
        ),
      },
      {
        key: 'language',
        header: 'Language',
        accessor: (submission: (typeof items)[number]) => submission.language,
        sortable: true,
        cell: (submission: (typeof items)[number]) => <span>{submission.language}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        accessor: (submission: (typeof items)[number]) => submission.status,
        sortable: true,
        cell: (submission: (typeof items)[number]) => <StatusBadge status={submission.status} />,
      },
      {
        key: 'reviewer',
        header: 'Reviewer',
        accessor: (submission: (typeof items)[number]) => submission.reviewer?.username ?? 'Unassigned',
        cell: (submission: (typeof items)[number]) => (
          <span className="text-sm text-zinc-300">{submission.reviewer?.username ?? 'Unassigned'}</span>
        ),
      },
      {
        key: 'created',
        header: 'Created',
        accessor: (submission: (typeof items)[number]) => submission.created_at,
        sortable: true,
        cell: (submission: (typeof items)[number]) => <span>{formatDate(submission.created_at)}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        accessor: (submission: (typeof items)[number]) => submission.id,
        cell: (submission: (typeof items)[number]) => (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" asChild>
              <Link to={`/submissions/${submission.id}`}>View</Link>
            </Button>
            {user?.role === 'author' && submission.status === 'pending' ? (
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="ghost">
                    Close
                  </Button>
                }
                title="Close submission?"
                description="This will end the request before review begins."
                actionLabel="Close submission"
                onConfirm={() => closeMutation.mutate(submission.id)}
              />
            ) : null}
          </div>
        ),
        className: 'text-right',
      },
    ],
    [closeMutation, user?.role]
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={user?.role === 'author' ? 'Author' : 'Workspace'}
        title="My Submissions"
        description="Search, filter, and track every review request in your queue."
        actions={
          user?.role === 'author' ? (
            <Button asChild>
              <Link to="/submissions/new">
                <Plus className="h-4 w-4" />
                New submission
              </Link>
            </Button>
          ) : undefined
        }
      />

      <SubmissionFilters params={params} onChange={setParams} languages={languageOptions} />

      {query.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : !items.length ? (
        <EmptyState
          icon={FileSearch}
          title="No submissions match these filters"
          description="Adjust the current filters or create a new submission to start a review."
          actionLabel={user?.role === 'author' ? 'Create submission' : 'Clear filters'}
          onAction={() =>
            user?.role === 'author'
              ? window.location.assign('/submissions/new')
              : setParams({ page: 1, size: 6, statuses: [] })
          }
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={items} rowKey={(submission) => submission.id} />
          </div>
          <div className="space-y-4 lg:hidden">
            {items.map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-border bg-surface/70 p-4">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-100">{submission.title}</p>
                      <StatusBadge status={submission.status} />
                    </div>
                    <p className="text-sm text-zinc-400">{submission.description}</p>
                    <p className="text-sm text-zinc-500">
                      {submission.language} • {submission.reviewer?.username ?? 'Unassigned'} •{' '}
                      {formatDate(submission.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link to={`/submissions/${submission.id}`}>View</Link>
                    </Button>
                    {user?.role === 'author' && submission.status === 'pending' ? (
                      <ConfirmDialog
                        trigger={
                          <Button size="sm" variant="ghost">
                            Close
                          </Button>
                        }
                        title="Close submission?"
                        description="This will end the request before review begins."
                        actionLabel="Close submission"
                        onConfirm={() => closeMutation.mutate(submission.id)}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Page {data?.page} of {data?.pages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={(data?.page ?? 1) <= 1}
                onClick={() => setParams((current) => ({ ...current, page: Math.max((current.page ?? 1) - 1, 1) }))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={(data?.page ?? 1) >= (data?.pages ?? 1)}
                onClick={() => setParams((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
