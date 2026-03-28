import { type SubmissionStatus, type SubmissionUrgency, type UserRole } from '@/types'

export const languageOptions = ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++']

export const submissionStatusOptions: SubmissionStatus[] = [
  'draft',
  'pending',
  'in_review',
  'changes_requested',
  'approved',
  'closed',
]

export const urgencyOptions: SubmissionUrgency[] = ['low', 'normal', 'high']

export const roleOptions: UserRole[] = ['author', 'reviewer', 'admin']

