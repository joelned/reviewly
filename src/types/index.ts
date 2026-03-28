export type UserRole = 'author' | 'reviewer' | 'admin'

export type SubmissionStatus =
  | 'draft'
  | 'pending'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'closed'

export type ReviewStatus = 'assigned' | 'in_progress' | 'submitted'

export type SubmissionUrgency = 'low' | 'normal' | 'high'

export type UserStatus = 'active' | 'inactive'

export type ReviewVerdict = 'approve' | 'request_changes'

export interface User {
  id: number
  email: string
  username: string
  role: UserRole
  avatar_url?: string
  created_at: string
  status?: UserStatus
}

export interface SubmissionFile {
  id: number
  filename: string
  content: string
  language: string
}

export interface SubmissionActivity {
  id: number
  label: string
  description: string
  created_at: string
}

export interface Submission {
  id: number
  title: string
  description: string
  language: string
  status: SubmissionStatus
  author: User
  reviewer?: User
  files: SubmissionFile[]
  created_at: string
  updated_at: string
  focus_area?: string
  urgency?: SubmissionUrgency
  review_preferences?: string
  activity?: SubmissionActivity[]
}

export interface ReviewComment {
  id: number
  review_id: number
  file_id: number
  line_number: number
  content: string
  author: User
  created_at: string
}

export interface Review {
  id: number
  submission_id: number
  reviewer: User
  status: ReviewStatus
  summary?: string
  rating?: number
  comments: ReviewComment[]
  created_at: string
  submitted_at?: string
  verdict?: ReviewVerdict
}

export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
  role: Extract<UserRole, 'author' | 'reviewer'>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiValidationError {
  field: string
  message: string
}

export interface ApiError {
  message: string
  status?: number
  errors?: ApiValidationError[]
}

export interface AuthResponse {
  token: AuthTokens
  user: User
}

export interface SubmissionListParams {
  page?: number
  size?: number
  search?: string
  language?: string
  statuses?: SubmissionStatus[]
  date_from?: string
  date_to?: string
}

export interface CreateSubmissionPayload {
  title: string
  description: string
  language: string
  files: SubmissionFile[]
  focus_area: string
  urgency: SubmissionUrgency
  reviewer_id: number
}

export interface SubmitReviewPayload {
  verdict: ReviewVerdict
  summary: string
  rating: number
}

export interface CreateCommentPayload {
  file_id: number
  line_number: number
  content: string
}

export interface UpdateRolePayload {
  role: UserRole
}

export interface AssignReviewerPayload {
  submissionId: number
  reviewerId: number
}

export interface DashboardStat {
  label: string
  value: number | string
  helper: string
  trend?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
