export type UserRole = 'SUBMITTER' | 'REVIEWER'
export type SubmissionStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
export type Visibility = 'PUBLIC' | 'ORG_ONLY' | 'PRIVATE'
export type NotificationType =
  | 'COMMENT'
  | 'REVIEW_ASSIGNED'
  | 'REPORT_READY'
  | 'STATUS_CHANGE'
  | 'ORPHANED_COMMENT'
  | 'QUOTA_WARNING'
  | 'SYSTEM'

export interface AuthUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  role: UserRole
  reputation: number
  orgSlug: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
}

export interface Submission {
  id: string
  title: string
  language: string
  status: SubmissionStatus
  visibility: Visibility
  authorId: string
  reviewerCount: number
  createdAt: string
  dimensions: string[]
}

export interface InlineComment {
  id: string
  lineStart: number
  lineEnd: number
  body: string
  author: AuthUser
  replies: InlineComment[]
  resolved: boolean
  orphaned: boolean
}

export interface AppNotification {
  id: string
  type: NotificationType
  message: string
  submissionTitle?: string
  read: boolean
  createdAt: string
}

export interface BillingInfo {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  price: number
  renewalDate: string
  submissionsUsed: number
  submissionsLimit: number
  overageRate: number
}
