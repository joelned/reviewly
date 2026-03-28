import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldAlert, UserCog } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { UserRoleSelector } from '@/features/admin/components/UserRoleSelector'
import { axios } from '@/lib/axios'
import { formatDate } from '@/lib/utils'
import { type PaginatedResponse, type UpdateRolePayload, type User, type UserRole } from '@/types'

interface PendingRoleChange {
  user: User
  role: UserRole
}

export function UsersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null)
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<User>>('/admin/users')
      return data
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, payload }: { userId: number; payload: UpdateRolePayload & { toggleStatus?: boolean } }) => {
      const { data } = await axios.put<User>(`/admin/users/${userId}/role`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const filteredUsers = useMemo(() => {
    const items = usersQuery.data?.items ?? []
    if (!search) {
      return items
    }

    const query = search.toLowerCase()
    return items.filter((user) =>
      [user.username, user.email, user.role].some((value) => value.toLowerCase().includes(query))
    )
  }, [search, usersQuery.data?.items])

  const columns = useMemo(
    () => [
      {
        key: 'username',
        header: 'Username',
        accessor: (user: User) => user.username,
        sortable: true,
        cell: (user: User) => (
          <div className="space-y-1">
            <p className="font-medium text-zinc-100">{user.username}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        accessor: (user: User) => user.role,
        sortable: true,
        cell: (user: User) => <StatusBadge status={user.role} />,
      },
      {
        key: 'status',
        header: 'Status',
        accessor: (user: User) => user.status ?? 'active',
        cell: (user: User) => <StatusBadge status={user.status === 'inactive' ? 'closed' : 'approved'} />,
      },
      {
        key: 'joined',
        header: 'Joined',
        accessor: (user: User) => user.created_at,
        sortable: true,
        cell: (user: User) => <span>{formatDate(user.created_at)}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        accessor: (user: User) => user.id,
        cell: (user: User) => (
          <div className="flex items-center justify-end gap-2">
            <UserRoleSelector value={user.role} onChange={(role) => setPendingRoleChange({ user, role })} />
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="ghost">
                  {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </Button>
              }
              title={`${user.status === 'inactive' ? 'Activate' : 'Deactivate'} ${user.username}?`}
              description="This updates the user's platform access immediately."
              actionLabel={user.status === 'inactive' ? 'Activate user' : 'Deactivate user'}
              onConfirm={() =>
                updateRoleMutation.mutate({
                  userId: user.id,
                  payload: {
                    role: user.role,
                    toggleStatus: true,
                  },
                })
              }
            />
          </div>
        ),
        className: 'text-right',
      },
    ],
    [updateRoleMutation]
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Manage account roles, access state, and who can participate in the review workflow."
      />

      <div className="rounded-2xl border border-border bg-surface/70 p-5">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by username, email, or role"
        />
      </div>

      {usersQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : filteredUsers.length ? (
        <>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={filteredUsers} rowKey={(user) => user.id} />
          </div>
          <div className="space-y-4 lg:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-border bg-surface/70 p-4">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-100">{user.username}</p>
                      <StatusBadge status={user.role} />
                      <StatusBadge status={user.status === 'inactive' ? 'closed' : 'approved'} />
                    </div>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                    <p className="text-xs text-zinc-500">Joined {formatDate(user.created_at)}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <UserRoleSelector value={user.role} onChange={(role) => setPendingRoleChange({ user, role })} />
                    <ConfirmDialog
                      trigger={
                        <Button size="sm" variant="ghost">
                          {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                        </Button>
                      }
                      title={`${user.status === 'inactive' ? 'Activate' : 'Deactivate'} ${user.username}?`}
                      description="This updates the user's platform access immediately."
                      actionLabel={user.status === 'inactive' ? 'Activate user' : 'Deactivate user'}
                      onConfirm={() =>
                        updateRoleMutation.mutate({
                          userId: user.id,
                          payload: {
                            role: user.role,
                            toggleStatus: true,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={UserCog}
          title="No users found"
          description="Try a different search term to find the person you want to manage."
          actionLabel="Clear search"
          onAction={() => setSearch('')}
        />
      )}

      {pendingRoleChange ? (
        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 sm:items-center">
              <ShieldAlert className="h-4 w-4" />
              Confirm role change for {pendingRoleChange.user.username} in the dialog above.
            </div>
            <Button variant="secondary" size="sm" onClick={() => setPendingRoleChange(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <AlertDialog open={Boolean(pendingRoleChange)} onOpenChange={(open) => !open && setPendingRoleChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingRoleChange
                ? `Change ${pendingRoleChange.user.username} to ${pendingRoleChange.role}?`
                : 'Change role'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Role updates change the routes and actions available to this user immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingRoleChange) return
                updateRoleMutation.mutate({
                  userId: pendingRoleChange.user.id,
                  payload: {
                    role: pendingRoleChange.role,
                  },
                })
                setPendingRoleChange(null)
              }}
            >
              Confirm role change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
