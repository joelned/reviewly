import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { type ReviewStatus, type SubmissionStatus, type UserRole } from '@/types'

type StatusKind = SubmissionStatus | ReviewStatus | UserRole

const variantMap: Record<StatusKind, ComponentProps<typeof Badge>['variant']> = {
  draft: 'default',
  pending: 'warning',
  in_review: 'secondary',
  changes_requested: 'destructive',
  approved: 'success',
  closed: 'default',
  assigned: 'warning',
  in_progress: 'secondary',
  submitted: 'success',
  author: 'secondary',
  reviewer: 'reviewer',
  admin: 'admin',
}

function toLabel(value: StatusKind) {
  return value.replace(/_/g, ' ')
}

export function StatusBadge({ status }: { status: StatusKind }) {
  return <Badge variant={variantMap[status]}>{toLabel(status)}</Badge>
}
